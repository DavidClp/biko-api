import { IProviderMetricsRepository } from '../repositories/IProviderMetricsRepository';
import { CreateProviderMetricDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class CreateProviderMetricUseCase {
  constructor(
    private providerMetricsRepository: IProviderMetricsRepository
  ) {}

  async execute(data: CreateProviderMetricDTO): Promise<void> {
    try {
      await this.providerMetricsRepository.create(data);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        title: 'Erro ao criar métrica',
        detail: 'Erro interno do servidor',
        origin: 'CreateProviderMetricUseCase.execute',
        statusCode: 500,
      });
    }
  }
}
