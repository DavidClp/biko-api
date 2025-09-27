import { IProviderMetricsRepository } from '../repositories/IProviderMetricsRepository';
import { ProviderMetricsResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class GetProviderMetricsUseCase {
  constructor(
    private providerMetricsRepository: IProviderMetricsRepository
  ) {}

  async execute(providerId: string, filters?: { query?: string; cityId?: string }): Promise<ProviderMetricsResponseDTO> {
    try {
      if (!providerId) {
        throw new AppError({
          title: 'ID do fornecedor obrigatório',
          detail: 'O ID do fornecedor é obrigatório para buscar métricas',
          origin: 'GetProviderMetricsUseCase.execute',
          statusCode: 400,
        });
      }

      return await this.providerMetricsRepository.getMetricsByProvider(providerId, filters);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        title: 'Erro ao buscar métricas',
        detail: 'Erro interno do servidor',
        origin: 'GetProviderMetricsUseCase.execute',
        statusCode: 500,
      });
    }
  }
}
