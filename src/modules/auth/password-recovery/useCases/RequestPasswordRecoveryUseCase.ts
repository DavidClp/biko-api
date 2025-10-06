import { sendEmail } from "@/shared/utils/sendEmailService";
import { randomBytes } from "crypto";
import { IRequestPasswordRecoveryDTO } from "../dtos/RequestPasswordRecoveryDTO";
import { PrismaClient } from "@prisma/client";

export class RequestPasswordRecoveryUseCase {
  async execute({ email }: IRequestPasswordRecoveryDTO): Promise<void> {
    const prisma = new PrismaClient()

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Gerar token único
    const token = randomBytes(32).toString("hex");
    
    // Token expira em 1 hora
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Invalidar tokens anteriores do usuário (marcar como usados)
    await prisma.passwordRecovery.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    // Criar novo registro de recuperação de senha
    await prisma.passwordRecovery.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // URL do frontend
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // HTML do email
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #f8ce27 0%, #db9d01 100%);
            color: #1A1A1A;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #f8ce27 0%, #db9d01 100%);
            color: #1A1A1A;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Recuperação de Senha</h1>
          </div>
          <div class="content">
            <p>Olá,</p>
            <p>Você solicitou a recuperação de senha da sua conta Biko.</p>
            <p>Clique no botão abaixo para redefinir sua senha:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
            </p>
            <p>Ou copie e cole o seguinte link no seu navegador:</p>
            <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">
              ${resetUrl}
            </p>
            <p><strong>Este link expira em 1 hora.</strong></p>
            <p>Se você não solicitou esta recuperação, ignore este email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Biko - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: user.email,
      subject: "Recuperação de Senha - Biko",
      html,
    });
  }
}

