import { providerRoutes } from '@/modules/providers/routes/provider.routes';
import { clientRoutes } from '@/modules/clients/routes/client.routes';
import { authRoutes } from '@/modules/auth/login/routes/auth.routes';
import { cityRoutes } from '@/modules/cities/routes/city.routes';
import { requestRoutes } from '@/modules/request/routes/request.routes';
import { messageRoutes } from '@/modules/messages/routes/message.routes';
import { serviceRoutes } from '@/modules/shared/routes/service.routes';
import { Request, Response, Router } from 'express';
import { importTransactionOfGerencianetService } from '@/modules/subscriptions-transactions-gerencianet/importTransactionOfGerencianet.service';
import { importSubscriptionOfGerencianetService } from '@/modules/subscriptions-transactions-gerencianet/importSubscriptionOfGerencianet.service';
import { plansRoutes } from '@/modules/plans/infra/http/express/routes';
import { subscriptionsRouter } from '@/modules/subscriptions/routes/subscriptions.routes';
import { transactionsRouter } from '@/modules/transactions/routes/transactions.routes';

const routes = Router();

routes.use('/auth', authRoutes);

routes.use('/providers', providerRoutes);

routes.use('/clients', clientRoutes);

routes.use('/cities', cityRoutes);

routes.use('/requests', requestRoutes);

routes.use('/messages', messageRoutes);

routes.use('/services', serviceRoutes);

routes.use('/plans', plansRoutes);

routes.use('/subscriptions', subscriptionsRouter);

routes.use('/transactions', transactionsRouter);

//routes.use(sharedRoutes);
//routes.use('/properties', propertiesRoutes);

routes.use('/ping', async (req: Request, res: Response) => {
  return res.json('PONG - V.0.1.1')
});

routes.post("/gerencianet/webhook", async (req: Request, res: Response) => {
  let { subscription_gateway_id, transaction_gateway_id }: any = req.query
  transaction_gateway_id = req?.body?.pix?.txid ? req?.body?.pix?.txid : transaction_gateway_id
  transaction_gateway_id = req?.body?.pix?.[0].txid ? req?.body?.pix?.[0].txid : transaction_gateway_id
  
  if (transaction_gateway_id) await importTransactionOfGerencianetService({ transaction_gateway_id })

  else await importSubscriptionOfGerencianetService({ subscription_gateway_id })

  return res.json({ message: "ok" })
})

export { routes };
