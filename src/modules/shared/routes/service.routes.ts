import { Router } from 'express';
import { ServiceController } from '../controllers';

const serviceRoutes = Router();
const serviceController = new ServiceController();

serviceRoutes.get('/', serviceController.list.bind(serviceController));

export { serviceRoutes };
