import { IClientRepository } from '../repositories';
import AppError from '../../../shared/errors/AppError';

export class DeleteClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new AppError({
        title: 'ID inválido',
        detail: 'ID do client é obrigatório',
        origin: 'DeleteClientUseCase.execute',
        statusCode: 400,
      });
    }

    // Verificar se o client existe
    const existingClient = await this.clientRepository.findById(id);
    if (!existingClient) {
      throw new AppError({
        title: 'Client não encontrado',
        detail: 'Client com o ID especificado não foi encontrado',
        origin: 'DeleteClientUseCase.execute',
        statusCode: 404,
      });
    }

    // Deletar o client
    await this.clientRepository.delete(id);
  }
}
