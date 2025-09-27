import { database } from '../../../shared/infra/database';
import { IProviderMetricsRepository } from './IProviderMetricsRepository';
import { CreateProviderMetricDTO, ProviderMetricsResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class ProviderMetricsRepository implements IProviderMetricsRepository {
  async create(data: CreateProviderMetricDTO): Promise<void> {
    try {
      await database.providerMetrics.create({
        data: {
          provider_id: data.provider_id,
          metric_type: data.metric_type,
          metadata: data.metadata || {},
        },
      });
    } catch (error) {
      throw new AppError({
        title: 'Erro ao criar métrica',
        detail: 'Não foi possível registrar a métrica no banco de dados',
        origin: 'ProviderMetricsRepository.create',
        statusCode: 500,
      });
    }
  }

  async getMetricsByProvider(providerId: string, filters?: { query?: string; cityId?: string }): Promise<ProviderMetricsResponseDTO> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Buscar métricas totais
      const totalMetrics = await database.providerMetrics.groupBy({
        by: ['metric_type'],
        where: {
          provider_id: providerId,
        },
        _sum: {
          count: true,
        },
      });

      // Buscar métricas de hoje
      const todayMetrics = await database.providerMetrics.groupBy({
        by: ['metric_type'],
        where: {
          provider_id: providerId,
          date: {
            gte: today,
          },
        },
        _sum: {
          count: true,
        },
      });

      // Buscar métricas da semana
      const weekMetrics = await database.providerMetrics.groupBy({
        by: ['metric_type'],
        where: {
          provider_id: providerId,
          date: {
            gte: weekAgo,
          },
        },
        _sum: {
          count: true,
        },
      });

      // Buscar métricas do mês
      const monthMetrics = await database.providerMetrics.groupBy({
        by: ['metric_type'],
        where: {
          provider_id: providerId,
          date: {
            gte: monthAgo,
          },
        },
        _sum: {
          count: true,
        },
      });

      // Buscar métricas diárias dos últimos 30 dias
      const dailyMetrics = await database.providerMetrics.groupBy({
        by: ['date', 'metric_type'],
        where: {
          provider_id: providerId,
          date: {
            gte: monthAgo,
          },
        },
        _sum: {
          count: true,
        },
        orderBy: {
          date: 'asc',
        },
      });

      // Processar dados
      const getMetricCount = (metrics: any[], type: string) => {
        const metric = metrics.find(m => m.metric_type === type);
        return metric?._sum?.count || 0;
      };

      // Agrupar métricas diárias por data
      const dailyMetricsMap = new Map<string, { search_appearances: number; profile_views: number }>();
      
      dailyMetrics.forEach(metric => {
        const dateKey = metric.date.toISOString().split('T')[0];
        if (!dailyMetricsMap.has(dateKey)) {
          dailyMetricsMap.set(dateKey, { search_appearances: 0, profile_views: 0 });
        }
        
        const dayData = dailyMetricsMap.get(dateKey)!;
        if (metric.metric_type === 'SEARCH_APPEARANCE') {
          dayData.search_appearances += metric._sum.count || 0;
        } else if (metric.metric_type === 'PROFILE_VIEW') {
          dayData.profile_views += metric._sum.count || 0;
        }
      });

      const dailyMetricsArray = Array.from(dailyMetricsMap.entries()).map(([date, data]) => ({
        date,
        search_appearances: data.search_appearances,
        profile_views: data.profile_views,
      }));

      return {
        total_search_appearances: getMetricCount(totalMetrics, 'SEARCH_APPEARANCE'),
        total_profile_views: getMetricCount(totalMetrics, 'PROFILE_VIEW'),
        search_appearances_today: getMetricCount(todayMetrics, 'SEARCH_APPEARANCE'),
        profile_views_today: getMetricCount(todayMetrics, 'PROFILE_VIEW'),
        search_appearances_this_week: getMetricCount(weekMetrics, 'SEARCH_APPEARANCE'),
        profile_views_this_week: getMetricCount(weekMetrics, 'PROFILE_VIEW'),
        search_appearances_this_month: getMetricCount(monthMetrics, 'SEARCH_APPEARANCE'),
        profile_views_this_month: getMetricCount(monthMetrics, 'PROFILE_VIEW'),
        daily_metrics: dailyMetricsArray,
      };
    } catch (error) {
      throw new AppError({
        title: 'Erro ao buscar métricas',
        detail: 'Não foi possível buscar as métricas do fornecedor',
        origin: 'ProviderMetricsRepository.getMetricsByProvider',
        statusCode: 500,
      });
    }
  }
}
