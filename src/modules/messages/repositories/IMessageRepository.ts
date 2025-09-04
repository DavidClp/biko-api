import { CreateMessageDTO, MessageResponseDTO, UpdateMessageViewedDTO } from '../dtos';

export interface IMessageRepository {
  create(data: CreateMessageDTO): Promise<MessageResponseDTO>;
  findById(id: string): Promise<MessageResponseDTO | null>;
  findByRequestId(requestId: string): Promise<MessageResponseDTO[]>;
  findBySenderId(senderId: string): Promise<MessageResponseDTO[]>;
  findByReceiverId(receiverId: string): Promise<MessageResponseDTO[]>;
  updateViewed(id: string, data: UpdateMessageViewedDTO): Promise<MessageResponseDTO>;
  delete(id: string): Promise<void>;
}
