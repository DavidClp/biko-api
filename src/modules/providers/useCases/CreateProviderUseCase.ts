import { IProviderRepository } from '../repositories';
import { CreateProviderDTO, ProviderResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class CreateProviderUseCase {
  constructor(private providerRepository: IProviderRepository) {}

  async execute(data: CreateProviderDTO): Promise<ProviderResponseDTO> {
    // Validações básicas
    if (!data.name || !data.service || !data.city) {
      throw new AppError({
        title: 'Dados inválidos',
        detail: 'Nome, serviço e cidade são obrigatórios',
        origin: 'CreateProviderUseCase.execute',
        statusCode: 400,
      });
    }

    // Verificar se já existe um provider para este usuário
    const existingProvider = await this.providerRepository.findByUserId(data.userId);
    if (existingProvider) {
      throw new AppError({
        title: 'Provider já existe',
        detail: 'Já existe um provider cadastrado para este usuário',
        origin: 'CreateProviderUseCase.execute',
        statusCode: 409,
      });
    }

    // Criar o provider
    const provider = await this.providerRepository.create(data);
    return provider;
  }
}
