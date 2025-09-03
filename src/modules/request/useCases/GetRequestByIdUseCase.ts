import { IRequestRepository } from '../repositories';
import { RequestResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class GetRequestByIdUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) { }

  async execute(id: string): Promise<RequestResponseDTO> {
    const request = await this.requestRepository.findById(id);

    if (!request) {
      throw new AppError({
        title: 'Request não encontrado',
        detail: 'Não foi possível encontrar o request especificado',
        origin: 'GetRequestByIdUseCase.execute',
        statusCode: 404,
      });
    }

    return request;
  }
}
