import { Router } from 'express';
import { userAuthenticatedMiddleware } from '../../../../../../shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';
import { CreatePlanController } from '../../../../use-cases/create-plan/CreatePlanController';
import { listPlansController } from '../../../../use-cases/list-plans/listPlansController';
import { findPlanController } from '../../../../use-cases/find-plans/findPlanController';
import { updatePlansController } from '../../../../use-cases/update-plan/updatePlansController';

const plansRoutes = Router();

plansRoutes.post('/', userAuthenticatedMiddleware(), CreatePlanController);
plansRoutes.get('/', userAuthenticatedMiddleware(), listPlansController);
plansRoutes.get('/:id', userAuthenticatedMiddleware(), findPlanController);
plansRoutes.put('/:id', userAuthenticatedMiddleware(), updatePlansController);

export { 
    plansRoutes
 };
