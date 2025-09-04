import { IMessageRepository } from '../repositories';
import { MessageResponseDTO } from '../dtos';

export class GetMessagesByReceiverIdUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(receiverId: string): Promise<MessageResponseDTO[]> {
    const messages = await this.messageRepository.findByReceiverId(receiverId);

    return messages;
  }
}
