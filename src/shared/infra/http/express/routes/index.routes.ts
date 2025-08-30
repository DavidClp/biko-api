import { providerRoutes } from '@/modules/providers/routes/provider.routes';
import { clientRoutes } from '@/modules/clients/routes/client.routes';
import { authRoutes } from '@/modules/auth/login/routes/auth.routes';
import { Request, Response, Router } from 'express';

const routes = Router();

// Rotas de autenticação
routes.use('/auth', authRoutes);

// Rotas de providers
routes.use('/providers', providerRoutes);

// Rotas de clients
routes.use('/clients', clientRoutes);

//routes.use(sharedRoutes);
//routes.use('/properties', propertiesRoutes);

routes.use('/ping', async (req: Request, res: Response) => {
  return res.json('PONG - V.0.1.0')
});

export { routes };
