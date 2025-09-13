import { Router } from 'express';
import { ClientController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const clientRoutes = Router();
const clientController = new ClientController();

// Rota para criar um novo client
clientRoutes.post('/', clientController.create.bind(clientController));

// Rota para buscar um client por ID
clientRoutes.get('/:id', userAuthenticatedMiddleware(), clientController.getById.bind(clientController));

// Rota para listar todos os clients
clientRoutes.get('/', userAuthenticatedMiddleware(), clientController.list.bind(clientController));

// Rota para atualizar um client
clientRoutes.put('/:id', userAuthenticatedMiddleware(), clientController.update.bind(clientController));

// Rota para deletar um client
clientRoutes.delete('/:id', userAuthenticatedMiddleware(), clientController.delete.bind(clientController));

export { clientRoutes };
