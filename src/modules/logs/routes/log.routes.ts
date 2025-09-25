import { Router } from 'express';
import { LogController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const logRoutes = Router();
const logController = new LogController();

// Rota para listar logs com filtros e paginação
// permitir so ADM
logRoutes.get('/'/* , userAuthenticatedMiddleware() */, logController.list.bind(logController));

// Rota para obter estatísticas dos logs
// permitir so ADM
logRoutes.get('/stats'/* , userAuthenticatedMiddleware() */, logController.stats.bind(logController));

export { logRoutes };
