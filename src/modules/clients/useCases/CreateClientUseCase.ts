import { IClientRepository } from '../repositories';
import { CreateClientDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { hash } from 'bcryptjs';
import { ISharedRepository } from '@/modules/shared/repositories/ISharedRepository';
import { Role } from '@prisma/client';
import { IRegisterResponse } from '@/modules/shared/dtos/IRegisterResponse';
import { sign } from 'jsonwebtoken';

export class CreateClientUseCase {
  constructor(
    private clientRepository: IClientRepository,
    private sharedRepository: ISharedRepository,
  ) { }

  async execute(data: CreateClientDTO): Promise<IRegisterResponse> {
    await this.validateData(data);

    const password = await hash(data.password, 10);

    const user = await this.sharedRepository.createUser({
      email: data.email,
      password: password,
      role: Role.CLIENT,
    })

    console.log(user);

    const client = await this.clientRepository.create({
      ...data,
      userId: user.id,
    })

    const token = sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1d'
      }
    );

    return {
      ...user,
      client,
      provider: null,
      token,
    };
  }

  private async validateData(data: CreateClientDTO): Promise<void> {
    if (!data.name || !data.email || !data.password) {
      throw new AppError({
        title: 'Dados inválidos',
        detail: 'Nome, e-mail e senha são obrigatórios',
        origin: 'CreateClientUseCase.execute',
        statusCode: 400,
      });
    }

    const existingUser = await this.sharedRepository.findUserByEmail({ email: data.email });
    if (existingUser) {
      throw new AppError({
        title: 'Usuário já existe',
        detail: 'Já existe um usuário cadastrado para este e-mail',
        origin: 'CreateClientUseCase.execute',
        statusCode: 409,
      });
    }
  }
}
