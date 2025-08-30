import { database } from '../../../shared/infra/database';
import { IClientRepository } from './IClientRepository';
import { CreateClientDTO, UpdateClientDTO, ClientResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { IClientResponseDTO } from '../dtos/IClientResponseDTO';

export class ClientRepository implements IClientRepository {
  async create(data: CreateClientDTO): Promise<IClientResponseDTO> {
    try {
      const client = await database.client.create({
        data: {
          userId: data.userId,
          name: data.name,
          city: data.city,
          phone: data.phone,
        },
      });

      return client as IClientResponseDTO;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao criar client',
        detail: 'Não foi possível criar o client no banco de dados',
        origin: 'ClientRepository.create',
        statusCode: 500,
      });
    }
  }

  async findById(id: string): Promise<ClientResponseDTO | null> {
    try {
      const client = await database.client.findUnique({
        where: { id },
      });

      return client as ClientResponseDTO | null;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar client',
        detail: 'Não foi possível buscar o client no banco de dados',
        origin: 'ClientRepository.findById',
        statusCode: 500,
      });
    }
  }

  async findByUserId(userId: string): Promise<ClientResponseDTO | null> {
    try {
      const client = await database.client.findUnique({
        where: { userId },
      });

      return client as ClientResponseDTO | null;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar client',
        detail: 'Não foi possível buscar o client por userId no banco de dados',
        origin: 'ClientRepository.findByUserId',
        statusCode: 500,
      });
    }
  }

  async findAll(): Promise<ClientResponseDTO[]> {
    try {
      const clients = await database.client.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return clients as ClientResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao listar clients',
        detail: 'Não foi possível listar os clients no banco de dados',
        origin: 'ClientRepository.findAll',
        statusCode: 500,
      });
    }
  }

  async update(id: string, data: UpdateClientDTO): Promise<ClientResponseDTO> {
    try {
      const client = await database.client.update({
        where: { id },
        data,
      });

      return client as ClientResponseDTO;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao atualizar client',
        detail: 'Não foi possível atualizar o client no banco de dados',
        origin: 'ClientRepository.update',
        statusCode: 500,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await database.client.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError({
        title: 'Erro ao deletar client',
        detail: 'Não foi possível deletar o client no banco de dados',
        origin: 'ClientRepository.delete',
        statusCode: 500,
      });
    }
  }

  async findByCity(city: string): Promise<ClientResponseDTO[]> {
    try {
      const clients = await database.client.findMany({
        where: { city: { contains: city, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
      });

      return clients as ClientResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar clients por cidade',
        detail: 'Não foi possível buscar os clients por cidade no banco de dados',
        origin: 'ClientRepository.findByCity',
        statusCode: 500,
      });
    }
  }
}
