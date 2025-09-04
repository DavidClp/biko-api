import { IMessageRepository } from '../repositories';
import { MessageResponseDTO } from '../dtos';

export class GetMessagesBySenderIdUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(senderId: string): Promise<MessageResponseDTO[]> {
    const messages = await this.messageRepository.findBySenderId(senderId);

    return messages;
  }
}
