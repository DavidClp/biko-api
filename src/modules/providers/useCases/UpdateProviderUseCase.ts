import { IProviderRepository } from '../repositories';
import { UpdateProviderDTO, ProviderResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class UpdateProviderUseCase {
  constructor(private providerRepository: IProviderRepository) {}

  async execute(id: string, data: UpdateProviderDTO): Promise<ProviderResponseDTO> {
    if (!id) {
      throw new AppError({
        title: 'ID inválido',
        detail: 'ID do provider é obrigatório',
        origin: 'UpdateProviderUseCase.execute',
        statusCode: 400,
      });
    }

    // Verificar se o provider existe
    const existingProvider = await this.providerRepository.findById(id);
    if (!existingProvider) {
      throw new AppError({
        title: 'Provider não encontrado',
        detail: 'Provider com o ID especificado não foi encontrado',
        origin: 'UpdateProviderUseCase.execute',
        statusCode: 404,
      });
    }

    // Atualizar o provider
    const updatedProvider = await this.providerRepository.update(id, data);
    return updatedProvider;
  }
}
