import { IRequestRepository } from '../repositories';
import { RequestResponseDTO } from '../dtos';

export class GetRequestsByProviderIdUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) { }

  async execute(providerId: string): Promise<RequestResponseDTO[]> {
    const requests = await this.requestRepository.findByProviderId(providerId);

    return requests;
  }
}
