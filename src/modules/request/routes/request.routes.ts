import { Router } from 'express';
import { RequestController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const requestRoutes = Router();
const requestController = new RequestController();

requestRoutes.get('/', userAuthenticatedMiddleware(), requestController.list.bind(requestController));

requestRoutes.get('/client/:clientId', userAuthenticatedMiddleware(), requestController.getByClientId.bind(requestController));

requestRoutes.get('/provider/:providerId', userAuthenticatedMiddleware(), requestController.getByProviderId.bind(requestController));

requestRoutes.get('/:id', userAuthenticatedMiddleware(), requestController.getById.bind(requestController));

requestRoutes.post('/', userAuthenticatedMiddleware(), requestController.create.bind(requestController));

requestRoutes.put('/:id', userAuthenticatedMiddleware(), requestController.update.bind(requestController));

requestRoutes.post('/send-budget/:id', userAuthenticatedMiddleware(), requestController.sendBudget.bind(requestController));

export { requestRoutes };
