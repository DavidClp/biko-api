import { CreateProviderMetricDTO, ProviderMetricsResponseDTO } from '../dtos';

export interface IProviderMetricsRepository {
  create(data: CreateProviderMetricDTO): Promise<void>;
  getMetricsByProvider(providerId: string, filters?: { query?: string; cityId?: string }): Promise<ProviderMetricsResponseDTO>;
}
