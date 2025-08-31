import { Router } from 'express';
import { ProviderController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const providerRoutes = Router();
const providerController = new ProviderController();

// Rota para criar um novo provider
providerRoutes.post('/', providerController.create.bind(providerController));

// Rota para buscar um provider por userId
providerRoutes.get('/:userId', providerController.getById.bind(providerController));

// Rota para listar todos os providers
providerRoutes.get('/', providerController.list.bind(providerController));

// Rota para atualizar um provider
providerRoutes.put('/:id', userAuthenticatedMiddleware(), providerController.update.bind(providerController));

// Rota para deletar um provider
providerRoutes.delete('/:id', userAuthenticatedMiddleware, providerController.delete.bind(providerController));

export { providerRoutes };
