import { Router } from 'express';
import { StateController } from '../controllers';

const stateRoutes = Router();
const stateController = new StateController();

stateRoutes.get('/', stateController.list.bind(stateController));

export { stateRoutes };
