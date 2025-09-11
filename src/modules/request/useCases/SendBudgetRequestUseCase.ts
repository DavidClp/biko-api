import { IRequestRepository } from '../repositories';
import { RequestResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';
import { SendBudgetRequestDTO } from '../dtos/SendBudgetRequestDTO';

export class SendBudgetRequestUseCase {
  constructor(
    private requestRepository: IRequestRepository
  ) { }

  async execute(id: string, data: SendBudgetRequestDTO): Promise<void> {
    await this.validateRequestExists(id);

    await this.requestRepository.update(id, { budget: data.budget, observation: data.observation });
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
}
