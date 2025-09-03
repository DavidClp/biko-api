import { database } from '../../../shared/infra/database';
import { IRequestRepository } from './IRequestRepository';
import { CreateRequestDTO, UpdateRequestDTO, RequestResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { RequestStatus } from '@prisma/client';

export class RequestRepository implements IRequestRepository {
  async create(data: CreateRequestDTO): Promise<RequestResponseDTO> {
    try {
      console.log('data', data);
      const request = await database.request.create({
        data: {
          clientId: data.clientId,
          providerId: data.providerId,
          service_type: data.service_type,
          description: data.description,
          address: data.address,
          urgency: data.urgency,
          value: data.value,
        },
      });

      return request as RequestResponseDTO;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao criar request',
        detail: 'Não foi possível criar o request no banco de dados',
        origin: 'RequestRepository.create',
        statusCode: 500,
      });
    }
  }

  async findById(id: string): Promise<RequestResponseDTO | null> {
    try {
      const request = await database.request.findUnique({
        where: { id },
      });

      return request as RequestResponseDTO | null;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar request',
        detail: 'Não foi possível buscar o request no banco de dados',
        origin: 'RequestRepository.findById',
        statusCode: 500,
      });
    }
  }

  async findAll(): Promise<RequestResponseDTO[]> {
    try {
      const requests = await database.request.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return requests as RequestResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao listar requests',
        detail: 'Não foi possível listar os requests no banco de dados',
        origin: 'RequestRepository.findAll',
        statusCode: 500,
      });
    }
  }

  async update(id: string, data: UpdateRequestDTO): Promise<RequestResponseDTO> {
    try {
      const request = await database.request.update({
        where: { id },
        data,
      });

      return request as RequestResponseDTO;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao atualizar request',
        detail: 'Não foi possível atualizar o request no banco de dados',
        origin: 'RequestRepository.update',
        statusCode: 500,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await database.request.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError({
        title: 'Erro ao deletar request',
        detail: 'Não foi possível deletar o request no banco de dados',
        origin: 'RequestRepository.delete',
        statusCode: 500,
      });
    }
  }

  async findByClientId(clientId: string): Promise<RequestResponseDTO[]> {
    try {
      const requests = await database.request.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          provider: true,
        },
      });

      return requests as RequestResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar requests por cliente',
        detail: 'Não foi possível buscar os requests por cliente no banco de dados',
        origin: 'RequestRepository.findByClientId',
        statusCode: 500,
      });
    }
  }

  async findByProviderId(providerId: string): Promise<RequestResponseDTO[]> {
    try {
      const requests = await database.request.findMany({
        where: { providerId },
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          provider: true,
        },
      });

      return requests as RequestResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar requests por provider',
        detail: 'Não foi possível buscar os requests por provider no banco de dados',
        origin: 'RequestRepository.findByProviderId',
        statusCode: 500,
      });
    }
  }

  async findByStatus(status: RequestStatus): Promise<RequestResponseDTO[]> {
    try {
      const requests = await database.request.findMany({
        where: { status },
        orderBy: { createdAt: 'desc' },
      });

      return requests as RequestResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar requests por status',
        detail: 'Não foi possível buscar os requests por status no banco de dados',
        origin: 'RequestRepository.findByStatus',
        statusCode: 500,
      });
    }
  }
}
