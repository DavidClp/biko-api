import { IMessageRepository } from '../repositories';
import AppError from '../../../shared/errors/AppError';

export class DeleteMessageUseCase {
  constructor(private messageRepository: IMessageRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new AppError({
        title: 'ID obrigatório',
        detail: 'O ID da mensagem é obrigatório',
        origin: 'DeleteMessageUseCase.execute',
        statusCode: 400,
      });
    }

    const existingMessage = await this.messageRepository.findById(id);
    if (!existingMessage) {
      throw new AppError({
        title: 'Mensagem não encontrada',
        detail: 'A mensagem especificada não foi encontrada',
        origin: 'DeleteMessageUseCase.execute',
        statusCode: 404,
      });
    }

    await this.messageRepository.delete(id);
  }
}
