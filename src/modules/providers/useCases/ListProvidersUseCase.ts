import { IGetListProvidersDTO, IProviderRepository } from '../repositories';
import { ProviderResponseDTO } from '../dtos';

export class ListProvidersUseCase {
  constructor(private providerRepository: IProviderRepository) {}

  async execute({ cityId, query, service }: IGetListProvidersDTO): Promise<ProviderResponseDTO[]> {
    const providers = await this.providerRepository.findAll({ cityId, query, service });
    return providers;
  }
}
