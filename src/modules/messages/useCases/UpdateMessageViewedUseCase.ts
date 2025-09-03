import { IMessageRepository } from '../repositories';
import { UpdateMessageViewedDTO, MessageResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class UpdateMessageViewedUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(id: string, data: UpdateMessageViewedDTO): Promise<MessageResponseDTO> {
    if (!id) {
      throw new AppError({
        title: 'ID obrigatório',
        detail: 'O ID da mensagem é obrigatório',
        origin: 'UpdateMessageViewedUseCase.execute',
        statusCode: 400,
      });
    }

    if (typeof data.viewed !== 'boolean') {
      throw new AppError({
        title: 'Dados inválidos',
        detail: 'O campo viewed deve ser um booleano',
        origin: 'UpdateMessageViewedUseCase.execute',
        statusCode: 400,
      });
    }

    const existingMessage = await this.messageRepository.findById(id);
    if (!existingMessage) {
      throw new AppError({
        title: 'Mensagem não encontrada',
        detail: 'A mensagem especificada não foi encontrada',
        origin: 'UpdateMessageViewedUseCase.execute',
        statusCode: 404,
      });
    }

    const message = await this.messageRepository.updateViewed(id, data);

    return message;
  }
}
