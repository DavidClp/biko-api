import { Router } from 'express';
import { AdvertiserController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const advertiserRoutes = Router();
const advertiserController = new AdvertiserController();

advertiserRoutes.get('/', userAuthenticatedMiddleware(), advertiserController.list.bind(advertiserController));

advertiserRoutes.get('/:id', userAuthenticatedMiddleware(), advertiserController.getById.bind(advertiserController));

advertiserRoutes.post('/', userAuthenticatedMiddleware(), advertiserController.create.bind(advertiserController));

advertiserRoutes.put('/:id', userAuthenticatedMiddleware(), advertiserController.update.bind(advertiserController));

advertiserRoutes.delete('/:id', userAuthenticatedMiddleware(), advertiserController.delete.bind(advertiserController));

export { advertiserRoutes };
