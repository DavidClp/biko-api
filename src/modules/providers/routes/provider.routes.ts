import { Router } from 'express';
import { ProviderController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const providerRoutes = Router();
const providerController = new ProviderController();

providerRoutes.post('/', providerController.create.bind(providerController));

providerRoutes.get('/:providerId', providerController.getById.bind(providerController));

providerRoutes.get('/', providerController.list.bind(providerController));

providerRoutes.put('/:id', userAuthenticatedMiddleware(), providerController.update.bind(providerController));

providerRoutes.delete('/:id', userAuthenticatedMiddleware, providerController.delete.bind(providerController));

export { providerRoutes };
