import { IProviderRepository } from '../repositories';
import { CreateProviderDTO, ProviderResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { ISharedRepository } from '@/modules/shared/repositories/ISharedRepository';
import { hash } from 'bcryptjs';
import { IRegisterResponse } from '@/modules/shared/dtos/IRegisterResponse';
import { Role } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { RecommendationRepository } from '@/modules/recommendations/repositories';

export class CreateProviderUseCase {
  constructor(
    private providerRepository: IProviderRepository,
    private sharedRepository: ISharedRepository,
    private recommendationRepository: RecommendationRepository
  ) { }

  async execute(data: CreateProviderDTO): Promise<IRegisterResponse> {
    await this.validateData(data);

    const password = await hash(data.password, 10);

    const user = await this.sharedRepository.createUser({
      email: data?.email?.toLowerCase()?.trim(),
      password: password,
      role: Role.PROVIDER,
    })

    const provider = await this.providerRepository.create({
      ...data,
      userId: user.id
    });

    // Processar código de recomendação se fornecido
    if (data.recommendationCode) {
      try {
        const recommendedUser = await this.recommendationRepository.findRecommendationByCode(data.recommendationCode);
        if (recommendedUser) {
          await this.recommendationRepository.createRecommendation(recommendedUser.id, user.id);
        }
      } catch (error) {
        // Log do erro mas não falha o cadastro
        console.error('Erro ao processar código de recomendação:', error);
      }
    }

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
      user: {
        ...user,
        client: null,
        provider,
      },
      token,
    };
  }


  private async validateData(data: CreateProviderDTO): Promise<void> {
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
