import { Router } from 'express';
import { ProviderController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';
import multer from 'multer';

const providerRoutes = Router();
const providerController = new ProviderController();

const upload = multer({ storage: multer.memoryStorage() });

providerRoutes.post('/', providerController.create.bind(providerController));

providerRoutes.get('/:providerId', providerController.getById.bind(providerController));

providerRoutes.get('/', providerController.list.bind(providerController));

providerRoutes.put('/:id', userAuthenticatedMiddleware(), providerController.update.bind(providerController));

providerRoutes.delete('/:id', userAuthenticatedMiddleware(), providerController.delete.bind(providerController));

providerRoutes.post('/update-profile-img', userAuthenticatedMiddleware(), upload.single("file"), providerController.updateImgProfile.bind(providerController));

export { providerRoutes };
