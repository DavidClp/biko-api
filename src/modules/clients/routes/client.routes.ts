import { Router } from 'express';
import { ClientController } from '../controllers';

const clientRoutes = Router();
const clientController = new ClientController();

// Rota para criar um novo client
clientRoutes.post('/', clientController.create.bind(clientController));

// Rota para buscar um client por ID
clientRoutes.get('/:id', clientController.getById.bind(clientController));

// Rota para listar todos os clients
clientRoutes.get('/', clientController.list.bind(clientController));

// Rota para atualizar um client
clientRoutes.put('/:id', clientController.update.bind(clientController));

// Rota para deletar um client
clientRoutes.delete('/:id', clientController.delete.bind(clientController));

export { clientRoutes };
