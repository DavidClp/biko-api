import { IRequestRepository } from '../repositories';
import { RequestResponseDTO } from '../dtos';

export class GetRequestsByClientIdUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) { }

  async execute(clientId: string): Promise<RequestResponseDTO[]> {
    const requests = await this.requestRepository.findByClientId(clientId);

    return requests;
  }
}
