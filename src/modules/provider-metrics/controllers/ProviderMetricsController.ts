import { Request, Response } from 'express';
import { CreateProviderMetricUseCase } from '../useCases/CreateProviderMetricUseCase';
import { GetProviderMetricsUseCase } from '../useCases/GetProviderMetricsUseCase';
import { CreateProviderMetricDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class ProviderMetricsController {
  constructor(
    private createProviderMetricUseCase: CreateProviderMetricUseCase,
    private getProviderMetricsUseCase: GetProviderMetricsUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateProviderMetricDTO = req.body;
      
      await this.createProviderMetricUseCase.execute(data);
      
      return res.status(201).json({
        message: 'Métrica registrada com sucesso',
      });
    } catch (error) {
      if (error instanceof AppError) {
        const errorData = error.error;
        return res.status(errorData.statusCode).json({
          error: errorData.title,
          detail: errorData.detail,
        });
      }
      
      return res.status(500).json({
        error: 'Erro interno do servidor',
        detail: 'Ocorreu um erro inesperado',
      });
    }
  }

  async getMetrics(req: Request, res: Response): Promise<Response> {
    try {
      const { providerId } = req.params;
      const { query, cityId } = req.query;
      
      const metrics = await this.getProviderMetricsUseCase.execute(providerId, {
        query: query as string,
        cityId: cityId as string,
      });
      
      return res.status(200).json({
        data: metrics,
      });
    } catch (error) {
      if (error instanceof AppError) {
        const errorData = error.error;
        return res.status(errorData.statusCode).json({
          error: errorData.title,
          detail: errorData.detail,
        });
      }
      
      return res.status(500).json({
        error: 'Erro interno do servidor',
        detail: 'Ocorreu um erro inesperado',
      });
    }
  }
}
