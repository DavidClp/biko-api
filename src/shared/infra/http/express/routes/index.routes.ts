import { providerRoutes } from '@/modules/providers/routes/provider.routes';
import { clientRoutes } from '@/modules/clients/routes/client.routes';
import { authRoutes } from '@/modules/auth/login/routes/auth.routes';
import { cityRoutes } from '@/modules/cities/routes/city.routes';
import { requestRoutes } from '@/modules/request/routes/request.routes';
import { messageRoutes } from '@/modules/messages/routes/message.routes';
import { Request, Response, Router } from 'express';

const routes = Router();

// Rotas de autenticação
routes.use('/auth', authRoutes);

// Rotas de providers
routes.use('/providers', providerRoutes);

// Rotas de clients
routes.use('/clients', clientRoutes);

// Rotas de cidades
routes.use('/cities', cityRoutes);

// Rotas de requests
routes.use('/requests', requestRoutes);

// Rotas de mensagens
routes.use('/messages', messageRoutes);

//routes.use(sharedRoutes);
//routes.use('/properties', propertiesRoutes);

routes.use('/ping', async (req: Request, res: Response) => {
  return res.json('PONG - V.0.1.0')
});

export { routes };
