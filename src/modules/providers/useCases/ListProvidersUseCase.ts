import { IProviderRepository } from '../repositories';
import { ProviderResponseDTO } from '../dtos';

export class ListProvidersUseCase {
  constructor(private providerRepository: IProviderRepository) {}

  async execute(): Promise<ProviderResponseDTO[]> {
    const providers = await this.providerRepository.findAll();
    return providers;
  }
}
