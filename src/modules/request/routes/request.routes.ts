import { Router } from 'express';
import { RequestController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const requestRoutes = Router();
const requestController = new RequestController();

// Rota para listar todos os requests
requestRoutes.get('/', userAuthenticatedMiddleware(), requestController.list.bind(requestController));

// Rota para buscar requests por client ID
requestRoutes.get('/client/:clientId', userAuthenticatedMiddleware(), requestController.getByClientId.bind(requestController));

// Rota para buscar requests por provider ID
requestRoutes.get('/provider/:providerId', userAuthenticatedMiddleware(), requestController.getByProviderId.bind(requestController));

// Rota para buscar um request por ID
requestRoutes.get('/:id', userAuthenticatedMiddleware(), requestController.getById.bind(requestController));

// Rota para criar um novo request
requestRoutes.post('/', userAuthenticatedMiddleware(), requestController.create.bind(requestController));

// Rota para atualizar um request
requestRoutes.put('/:id', userAuthenticatedMiddleware(), requestController.update.bind(requestController));

requestRoutes.post('/send-budget/:id', userAuthenticatedMiddleware(), requestController.sendBudget.bind(requestController));

export { requestRoutes };
