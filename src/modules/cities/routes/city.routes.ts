import { Router } from 'express';
import { CityController } from '../controllers';

const cityRoutes = Router();
const cityController = new CityController();

// Rota para listar cidades com filtros e paginação
cityRoutes.get('/', cityController.list.bind(cityController));

export { cityRoutes };
