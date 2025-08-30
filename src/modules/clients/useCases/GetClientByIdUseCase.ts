import { IClientRepository } from '../repositories';
import { ClientResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class GetClientByIdUseCase {
  constructor(private clientRepository: IClientRepository) {}

  async execute(id: string): Promise<ClientResponseDTO> {
    if (!id) {
      throw new AppError({
        title: 'ID inválido',
        detail: 'ID do client é obrigatório',
        origin: 'GetClientByIdUseCase.execute',
        statusCode: 400,
      });
    }

    const client = await this.clientRepository.findById(id);
    
    if (!client) {
      throw new AppError({
        title: 'Client não encontrado',
        detail: 'Client com o ID especificado não foi encontrado',
        origin: 'GetClientByIdUseCase.execute',
        statusCode: 404,
      });
    }

    return client;
  }
}
