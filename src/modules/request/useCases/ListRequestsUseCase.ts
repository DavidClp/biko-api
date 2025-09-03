import { IRequestRepository } from '../repositories';
import { RequestResponseDTO } from '../dtos';

export class ListRequestsUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) { }

  async execute(): Promise<RequestResponseDTO[]> {
    const requests = await this.requestRepository.findAll();

    return requests;
  }
}
