import { Router } from 'express';
import { RecommendationController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const recommendationRoutes = Router();
const recommendationController = new RecommendationController();

// Gerar código de recomendação (requer autenticação)
recommendationRoutes.post('/generate-code', userAuthenticatedMiddleware(), recommendationController.generateCode.bind(recommendationController));

// Criar recomendação usando código (requer autenticação)
recommendationRoutes.post('/create', userAuthenticatedMiddleware(), recommendationController.createRecommendation.bind(recommendationController));

// Buscar recomendações feitas pelo usuário (requer autenticação)
recommendationRoutes.get('/my-recommendations', userAuthenticatedMiddleware(), recommendationController.getUserRecommendations.bind(recommendationController));

// Buscar usuário por código de recomendação (público - para tela de cadastro)
recommendationRoutes.get('/user/:code', recommendationController.getUserByCode.bind(recommendationController));

export { recommendationRoutes };
