import { Router } from 'express';
import { ProviderController } from '../controllers';

const providerRoutes = Router();
const providerController = new ProviderController();

// Rota para criar um novo provider
providerRoutes.post('/', providerController.create.bind(providerController));

// Rota para buscar um provider por ID
providerRoutes.get('/:id', providerController.getById.bind(providerController));

// Rota para listar todos os providers
providerRoutes.get('/', providerController.list.bind(providerController));

// Rota para atualizar um provider
providerRoutes.put('/:id', providerController.update.bind(providerController));

// Rota para deletar um provider
providerRoutes.delete('/:id', providerController.delete.bind(providerController));

export { providerRoutes };
