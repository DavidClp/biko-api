import { database } from '../../../shared/infra/database';
import { IMessageRepository } from './IMessageRepository';
import { CreateMessageDTO, MessageResponseDTO, UpdateMessageViewedDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class MessageRepository implements IMessageRepository {
  async create(data: CreateMessageDTO): Promise<MessageResponseDTO> {
    try {
      const message = await database.message.create({
        data: {
          request_id: data.request_id,
          content: data.content,
          sender_id: data.sender_id,
          receiver_id: data.receiver_id,
          type: data.type || 'TEXT',
        },
      });

      return message as MessageResponseDTO;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao criar mensagem',
        detail: 'Não foi possível criar a mensagem no banco de dados',
        origin: 'MessageRepository.create',
        statusCode: 500,
      });
    }
  }

  async findById(id: string): Promise<MessageResponseDTO | null> {
    try {
      const message = await database.message.findUnique({
        where: { id },
      });

      return message as MessageResponseDTO | null;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar mensagem',
        detail: 'Não foi possível buscar a mensagem no banco de dados',
        origin: 'MessageRepository.findById',
        statusCode: 500,
      });
    }
  }

  async findByRequestId(requestId: string): Promise<MessageResponseDTO[]> {
    try {
      const messages = await database.message.findMany({
        where: { request_id: requestId },
        orderBy: { createdAt: 'asc' },
      });

      return messages as MessageResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar mensagens',
        detail: 'Não foi possível buscar as mensagens no banco de dados',
        origin: 'MessageRepository.findByRequestId',
        statusCode: 500,
      });
    }
  }

  async findBySenderId(senderId: string): Promise<MessageResponseDTO[]> {
    try {
      const messages = await database.message.findMany({
        where: { sender_id: senderId },
        orderBy: { createdAt: 'desc' },
      });

      return messages as MessageResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar mensagens',
        detail: 'Não foi possível buscar as mensagens no banco de dados',
        origin: 'MessageRepository.findBySenderId',
        statusCode: 500,
      });
    }
  }

  async findByReceiverId(receiverId: string): Promise<MessageResponseDTO[]> {
    try {
      const messages = await database.message.findMany({
        where: { receiver_id: receiverId },
        orderBy: { createdAt: 'desc' },
      });

      return messages as MessageResponseDTO[];
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar mensagens',
        detail: 'Não foi possível buscar as mensagens no banco de dados',
        origin: 'MessageRepository.findByReceiverId',
        statusCode: 500,
      });
    }
  }

  async updateViewed(id: string, data: UpdateMessageViewedDTO): Promise<MessageResponseDTO> {
    try {
      const message = await database.message.update({
        where: { id },
        data: {
          viewed: data.viewed,
        },
      });

      return message as MessageResponseDTO;
    } catch (error) {
      throw new AppError({
        title: 'Erro ao atualizar mensagem',
        detail: 'Não foi possível atualizar a mensagem no banco de dados',
        origin: 'MessageRepository.updateViewed',
        statusCode: 500,
      });
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await database.message.delete({
        where: { id },
      });
    } catch (error) {
      throw new AppError({
        title: 'Erro ao deletar mensagem',
        detail: 'Não foi possível deletar a mensagem no banco de dados',
        origin: 'MessageRepository.delete',
        statusCode: 500,
      });
    }
  }
}
