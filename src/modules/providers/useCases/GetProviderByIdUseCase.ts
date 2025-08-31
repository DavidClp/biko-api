import { IProviderRepository } from '../repositories';
import { ProviderResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class GetProviderByIdUseCase {
  constructor(private providerRepository: IProviderRepository) {}

  async execute(userId: string): Promise<ProviderResponseDTO> {
    if (!userId) {
      throw new AppError({
        title: 'ID inválido',
        detail: 'ID do provider é obrigatório',
        origin: 'GetProviderByIdUseCase.execute',
        statusCode: 400,
      });
    }

    const provider = await this.providerRepository.findByUserId(userId);
    
    if (!provider) {
      throw new AppError({
        title: 'Provider não encontrado',
        detail: 'Provider com o ID especificado não foi encontrado',
        origin: 'GetProviderByIdUseCase.execute',
        statusCode: 404,
      });
    }

    return provider;
  }
}
