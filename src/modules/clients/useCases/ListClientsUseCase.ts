import { IClientRepository } from '../repositories';
import { ClientResponseDTO } from '../dtos';

export class ListClientsUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(): Promise<ClientResponseDTO[]> {
    const clients = await this.clientRepository.findAll();
    return clients;
  }
}
