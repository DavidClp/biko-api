import { Router } from 'express';
import { ProviderMetricsController } from '../controllers/ProviderMetricsController';
import { CreateProviderMetricUseCase } from '../useCases/CreateProviderMetricUseCase';
import { GetProviderMetricsUseCase } from '../useCases/GetProviderMetricsUseCase';
import { ProviderMetricsRepository } from '../repositories/ProviderMetricsRepository';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const providerMetricsRoutes = Router();

const providerMetricsRepository = new ProviderMetricsRepository();
const createProviderMetricUseCase = new CreateProviderMetricUseCase(providerMetricsRepository);
const getProviderMetricsUseCase = new GetProviderMetricsUseCase(providerMetricsRepository);
const providerMetricsController = new ProviderMetricsController(
  createProviderMetricUseCase,
  getProviderMetricsUseCase
);

// Rota para registrar métricas (pode ser chamada sem autenticação para tracking)
providerMetricsRoutes.post('/', providerMetricsController.create.bind(providerMetricsController));

// Rota para buscar métricas de um fornecedor (requer autenticação)
providerMetricsRoutes.get('/:providerId', userAuthenticatedMiddleware(), providerMetricsController.getMetrics.bind(providerMetricsController));

export { providerMetricsRoutes };
