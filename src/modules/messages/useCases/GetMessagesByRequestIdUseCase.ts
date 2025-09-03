import { IMessageRepository } from '../repositories';
import { MessageResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class GetMessagesByRequestIdUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(requestId: string): Promise<MessageResponseDTO[]> {
    if (!requestId) {
      throw new AppError({
        title: 'RequestId obrigatório',
        detail: 'O requestId é obrigatório para buscar mensagens',
        origin: 'GetMessagesByRequestIdUseCase.execute',
        statusCode: 400,
      });
    }

    const messages = await this.messageRepository.findByRequestId(requestId);

    return messages;
  }
}
