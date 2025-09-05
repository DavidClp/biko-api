import { database } from '../../../shared/infra/database';
import { ICreateUser, IUser } from '../dtos/IUser';
import { IServiceResponseDTO } from '../dtos/IServiceResponseDTO';
import { ISharedRepository } from './ISharedRepository';
import AppError from '../../../shared/errors/AppError';

export class SharedRepository implements ISharedRepository {
  async createUser(data: ICreateUser): Promise<IUser> {
    try {
      const user = await database.user.create({
        data: {
          email: data.email,
          password: data.password,
          role: data.role,
        }
      });

      return user as IUser;
    } catch (error) {
      console.error('❌ - Erro ao criar usuário:', error);
      
      // Se for um erro de validação do Prisma
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as any;
        
        if (prismaError.code === 'P2002') {
          throw new AppError({
            title: 'E-mail já existe',
            detail: 'Já existe um usuário cadastrado com este e-mail',
            origin: 'SharedRepository.createUser',
            statusCode: 409,
          });
        }
      }
      
      throw new AppError({
        title: 'Erro ao criar usuário',
        detail: 'Ocorreu um erro inesperado ao criar o usuário',
        origin: 'SharedRepository.createUser',
        statusCode: 500,
      });
    }
  }

  async updateProviderOfUSer({ providerId, userId }: { providerId: string, userId: string }): Promise<void> {
    try {
      await database.user.update({
        where: { id: userId },
        data: { provider: { connect: { id: providerId } } },
      });
    } catch (error) {
      console.error('❌ - Erro ao atualizar provider do usuário:', error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as any;
        
        if (prismaError.code === 'P2025') {
          throw new AppError({
            title: 'Usuário não encontrado',
            detail: 'O usuário especificado não foi encontrado',
            origin: 'SharedRepository.updateProviderOfUSer',
            statusCode: 404,
          });
        }
      }
      
      throw new AppError({
        title: 'Erro ao atualizar provider',
        detail: 'Ocorreu um erro inesperado ao atualizar o provider do usuário',
        origin: 'SharedRepository.updateProviderOfUSer',
        statusCode: 500,
      });
    }
  }

  async updateClientOfUSer({ clientId, userId }: { clientId: string, userId: string }): Promise<void> {
    try {
      await database.user.update({
        where: { id: userId },
        data: { client: { connect: { id: clientId } } },
      });
    } catch (error) {
      console.error('❌ - Erro ao atualizar client do usuário:', error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as any;
        
        if (prismaError.code === 'P2025') {
          throw new AppError({
            title: 'Usuário não encontrado',
            detail: 'O usuário especificado não foi encontrado',
            origin: 'SharedRepository.updateClientOfUSer',
            statusCode: 404,
          });
        }
      }
      
      throw new AppError({
        title: 'Erro ao atualizar client',
        detail: 'Ocorreu um erro inesperado ao atualizar o client do usuário',
        origin: 'SharedRepository.updateClientOfUSer',
        statusCode: 500,
      });
    }
  }

  async findUserByEmail({ email }: { email: string }): Promise<IUser> {
    try {
      const user = await database.user.findUnique({
        where: { email },
      });

      return user as IUser;
    } catch (error) {
      console.error('❌ - Erro ao buscar usuário por e-mail:', error);
      
      throw new AppError({
        title: 'Erro ao buscar usuário',
        detail: 'Ocorreu um erro inesperado ao buscar o usuário',
        origin: 'SharedRepository.findUserByEmail',
        statusCode: 500,
      });
    }
  }

  async listServices({ name }: { name?: string }): Promise<IServiceResponseDTO[]> {
    try {
      const services = await database.service.findMany({
        where: name ? {
          name: {
            contains: name,
            mode: 'insensitive'
          }
        } : {},
        orderBy: {
          name: 'asc'
        }
      });

      return services as IServiceResponseDTO[];
    } catch (error) {
      console.error('❌ - Erro ao buscar serviços:', error);
      
      throw new AppError({
        title: 'Erro ao buscar serviços',
        detail: 'Ocorreu um erro inesperado ao buscar os serviços',
        origin: 'SharedRepository.listServices',
        statusCode: 500,
      });
    }
  }
}
