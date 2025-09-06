import { IProviderRepository } from '../repositories';
import AppError from '../../../shared/errors/AppError';

export class DeleteProviderUseCase {
  constructor(private providerRepository: IProviderRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new AppError({
        title: 'ID inválido',
        detail: 'ID do provider é obrigatório',
        origin: 'DeleteProviderUseCase.execute',
        statusCode: 400,
      });
    }

    const existingProvider = await this.providerRepository.findById(id);
    if (!existingProvider) {
      throw new AppError({
        title: 'Provider não encontrado',
        detail: 'Provider com o ID especificado não foi encontrado',
        origin: 'DeleteProviderUseCase.execute',
        statusCode: 404,
      });
    }

    await this.providerRepository.delete(id);
  }
}
