import { database } from '../../../shared/infra/database';
import { IGetListProvidersDTO, IProviderRepository } from './IProviderRepository';
import { CreateProviderDTO, UpdateProviderDTO, ProviderResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class ProviderRepository implements IProviderRepository {
  async create(data: CreateProviderDTO): Promise<ProviderResponseDTO> {
    try {
      const provider = await database.provider.create({
        data: {
          userId: data.userId,
          name: data.name,
          service: data.service,
          description: data.description,
          cityId: data.city,
          phone: data.phone,
          socialLinks: data.socialLinks,
          photoUrl: data.photoUrl,
        },
      });

      return provider as ProviderResponseDTO;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao criar provider',
        detail: 'Não foi possível criar o provider no banco de dados',
        origin: 'ProviderRepository.create',
        statusCode: 500,
      });
    }
  }

  async findById(id: string): Promise<ProviderResponseDTO | null> {
    try {
      const provider = await database.provider.findUnique({
        where: { id },
      });

      return provider as ProviderResponseDTO | null;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar provider',
        detail: 'Não foi possível buscar o provider no banco de dados',
        origin: 'ProviderRepository.findById',
        statusCode: 500,
      });
    }
  }

  async findByUserId(userId: string): Promise<ProviderResponseDTO | null> {
    try {
      const provider = await database.provider.findUnique({
        where: { userId },
        include: {
          user: true,
        },
      });

      return provider as ProviderResponseDTO | null;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar provider',
        detail: 'Não foi possível buscar o provider por userId no banco de dados',
        origin: 'ProviderRepository.findByUserId',
        statusCode: 500,
      });
    }
  }

  async findAll({ cityId, query, service }: IGetListProvidersDTO): Promise<ProviderResponseDTO[]> {
    try {
      const providers = await database.provider.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          city: {
            select: {
              name: true,
            },
          },
        },
        where: {
          cityId,
          service,
          name: { contains: query, mode: 'insensitive' },
        },
      });

      return providers.map((provider) => ({
        ...provider,
        cityName: provider.city?.name,
      })) as ProviderResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao listar providers',
        detail: 'Não foi possível listar os providers no banco de dados',
        origin: 'ProviderRepository.findAll',
        statusCode: 500,
      });
    }
  }

  async update(id: string, data: UpdateProviderDTO): Promise<ProviderResponseDTO> {
    try {
      console.log("Atualizando provider", data);
      const provider = await database.provider.update({
        where: { id },
        data,
      });

      console.log(provider);
      return provider as ProviderResponseDTO;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao atualizar provider',
        detail: 'Não foi possível atualizar o provider no banco de dados',
        origin: 'ProviderRepository.update',
        statusCode: 500,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await database.provider.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError({
        title: 'Erro ao deletar provider',
        detail: 'Não foi possível deletar o provider no banco de dados',
        origin: 'ProviderRepository.delete',
        statusCode: 500,
      });
    }
  }

  async findByStatus(status: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<ProviderResponseDTO[]> {
    try {
      const providers = await database.provider.findMany({
        where: { status },
        orderBy: { createdAt: 'desc' },
      });

      return providers as ProviderResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar providers por status',
        detail: 'Não foi possível buscar os providers por status no banco de dados',
        origin: 'ProviderRepository.findByStatus',
        statusCode: 500,
      });
    }
  }

  async findByCity(city: string): Promise<ProviderResponseDTO[]> {
    try {
      const providers = await database.provider.findMany({
        where: { city: { contains: city, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      });

      return providers as ProviderResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar providers por cidade',
        detail: 'Não foi possível buscar os providers por cidade no banco de dados',
        origin: 'ProviderRepository.findByCity',
        statusCode: 500,
      });
    }
  }

  async findByService(service: string): Promise<ProviderResponseDTO[]> {
    try {
      const providers = await database.provider.findMany({
        where: { service: { contains: service, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      });

      return providers as ProviderResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar providers por serviço',
        detail: 'Não foi possível buscar os providers por serviço no banco de dados',
        origin: 'ProviderRepository.findByService',
        statusCode: 500,
      });
    }
  }
}
