import { IMessageRepository } from '../repositories';
import { CreateMessageDTO, MessageResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class CreateMessageUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(data: CreateMessageDTO): Promise<MessageResponseDTO> {
    await this.validateData(data);

    const message = await this.messageRepository.create(data);

    return message;
  }

  private async validateData(data: CreateMessageDTO): Promise<void> {
    if (!data.request_id || !data.content || !data.sender_id || !data.receiver_id) {
      throw new AppError({
        title: 'Dados inválidos',
        detail: 'RequestId, conteúdo, senderId e receiverId são obrigatórios',
        origin: 'CreateMessageUseCase.execute',
        statusCode: 400,
      });
    }

    if (data.content.trim().length === 0) {
      throw new AppError({
        title: 'Conteúdo inválido',
        detail: 'O conteúdo da mensagem não pode estar vazio',
        origin: 'CreateMessageUseCase.execute',
        statusCode: 400,
      });
    }

    if (data.sender_id === data.receiver_id) {
      throw new AppError({
        title: 'Dados inválidos',
        detail: 'O remetente não pode ser o mesmo que o destinatário',
        origin: 'CreateMessageUseCase.execute',
        statusCode: 400,
      });
    }
  }
}
