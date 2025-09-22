import { IRequestRepository } from '../repositories';
import { UpdateRequestDTO, RequestResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class UpdateRequestUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) { }

  async execute(id: string, data: UpdateRequestDTO): Promise<RequestResponseDTO> {
    this.validateData(data);

    let value = data?.value;

    if (data?.status === "ACCEPTED" && data?.budgetStatus === "ACCEPTED") {
      value = data?.budget;
    }

    const request = await this.requestRepository.update(id, {
      ...data,
      value,
    });

    return request;
  }

  private validateData(data: UpdateRequestDTO): void {
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
