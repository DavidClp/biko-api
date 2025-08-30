import { IClientRepository } from '../repositories';
import { UpdateClientDTO, ClientResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class UpdateClientUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string, data: UpdateClientDTO): Promise<ClientResponseDTO> {
    if (!id) {
      throw new AppError({
        title: 'ID inválido',
        detail: 'ID do client é obrigatório',
        origin: 'UpdateClientUseCase.execute',
        statusCode: 400,
      });
    }

    // Verificar se o client existe
    const existingClient = await this.clientRepository.findById(id);
    if (!existingClient) {
      throw new AppError({
        title: 'Client não encontrado',
        detail: 'Client com o ID especificado não foi encontrado',
        origin: 'UpdateClientUseCase.execute',
        statusCode: 404,
      });
    }

    // Atualizar o client
    const updatedClient = await this.clientRepository.update(id, data);
    return updatedClient;
  }
}
