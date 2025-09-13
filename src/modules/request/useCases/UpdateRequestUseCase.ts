import { IRequestRepository } from '../repositories';
import { UpdateRequestDTO, RequestResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class UpdateRequestUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) { }

  async execute(id: string, data: UpdateRequestDTO): Promise<RequestResponseDTO> {
    await this.validateRequestExists(id);
    await this.validateData(data);

    const request = await this.requestRepository.update(id, data);

    return request;
  }

  private async validateRequestExists(id: string): Promise<void> {
    const existingRequest = await this.requestRepository.findById(id);
    if (!existingRequest) {
      throw new AppError({
        title: 'Request não encontrado',
        detail: 'Não foi possível encontrar o request especificado',
        origin: 'UpdateRequestUseCase.execute',
        statusCode: 404,
      });
    }
  }

  private async validateData(data: UpdateRequestDTO): Promise<void> {
    if (data.value && data.value.lessThan(0)) {
      throw new AppError({
        title: 'Valor inválido',
        detail: 'O valor deve ser maior ou igual a zero',
        origin: 'UpdateRequestUseCase.execute',
        statusCode: 400,
      });
    }
  }
}
