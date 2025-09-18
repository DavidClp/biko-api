import { Router } from 'express';
import { ProviderReviewController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const providerReviewRoutes = Router();
const providerReviewController = new ProviderReviewController();

// Criar review
providerReviewRoutes.post('/', userAuthenticatedMiddleware(), providerReviewController.create.bind(providerReviewController));

// Listar reviews por provider
providerReviewRoutes.get('/provider/:providerId', providerReviewController.getByProviderId.bind(providerReviewController));

export { providerReviewRoutes };
