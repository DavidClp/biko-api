import { PrismaClient } from "@prisma/client";
import { IResetPasswordDTO } from "../dtos/ResetPasswordDTO";
import { hash } from "bcryptjs";

export class ResetPasswordUseCase {
  async execute({ token, newPassword }: IResetPasswordDTO): Promise<void> {

    const prisma = new PrismaClient()

    const passwordRecovery = await prisma.passwordRecovery.findUnique({
      where: { token },
      include: { user: true },
    });

    // Validar token
    if (!passwordRecovery) {
      throw new Error("Token inválido ou expirado");
    }

    if (passwordRecovery.used) {
      throw new Error("Token já foi utilizado");
    }

    if (passwordRecovery.expiresAt < new Date()) {
      throw new Error("Token expirado");
    }

    // Validar senha (mínimo 6 caracteres)
    if (newPassword.length < 6) {
      throw new Error("A senha deve ter no mínimo 6 caracteres");
    }

    // Hash da nova senha
    const hashedPassword = await hash(newPassword, 10);

    // Atualizar senha e marcar token como usado em uma transação
    await prisma.$transaction([
      prisma.user.update({
        where: { id: passwordRecovery.userId },
        data: {
          password: hashedPassword,
        },
      }),
      prisma.passwordRecovery.update({
        where: { id: passwordRecovery.id },
        data: {
          used: true,
          usedAt: new Date(),
        },
      }),
    ]);
  }
}

