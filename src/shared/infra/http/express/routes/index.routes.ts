import { providerRoutes } from '@/modules/providers/routes/provider.routes';
import { providerReviewRoutes } from '@/modules/providers/routes/provider-review.routes';
import { providerPhotoRoutes } from '@/modules/provider-photos/routes/provider-photo.routes';
import { clientRoutes } from '@/modules/clients/routes/client.routes';
import { authRoutes } from '@/modules/auth/login/routes/auth.routes';
import { passwordRecoveryRouter } from '@/modules/auth/password-recovery/routes/password-recovery.routes';
import { cityRoutes } from '@/modules/cities/routes/city.routes';
import { stateRoutes } from '@/modules/states/routes/state.routes';
import { requestRoutes } from '@/modules/request/routes/request.routes';
import { messageRoutes } from '@/modules/messages/routes/message.routes';
import { serviceRoutes } from '@/modules/shared/routes/service.routes';
import { Request, Response, Router } from 'express';
import { importTransactionOfGerencianetService } from '@/modules/subscriptions-transactions-gerencianet/importTransactionOfGerencianet.service';
import { importSubscriptionOfGerencianetService } from '@/modules/subscriptions-transactions-gerencianet/importSubscriptionOfGerencianet.service';
import { plansRoutes } from '@/modules/plans/infra/http/express/routes';
import { subscriptionsRouter } from '@/modules/subscriptions/routes/subscriptions.routes';
import { transactionsRouter } from '@/modules/transactions/routes/transactions.routes';
import { adminRoutes } from '@/modules/admin/routes';
import { advertiserRoutes } from '@/modules/advertisers/routes/advertiser.routes';
import { bannerRoutes } from '@/modules/banners/routes/banner.routes';
import { recommendationRoutes } from '@/modules/recommendations/routes/recommendation.routes';
import { database } from '@/shared/infra/database';

const routes = Router();

routes.use('/auth', authRoutes);

routes.use('/password-recovery', passwordRecoveryRouter);

routes.use('/providers', providerRoutes);

routes.use('/provider-reviews', providerReviewRoutes);

routes.use('/provider-photos', providerPhotoRoutes);

routes.use('/clients', clientRoutes);

routes.use('/cities', cityRoutes);

routes.use('/states', stateRoutes);

routes.use('/requests', requestRoutes);

routes.use('/messages', messageRoutes);

routes.use('/services', serviceRoutes);

routes.use('/plans', plansRoutes);

routes.use('/subscriptions', subscriptionsRouter);

routes.use('/transactions', transactionsRouter);

routes.use('/admin', adminRoutes);

routes.use('/advertisers', advertiserRoutes);

routes.use('/banners', bannerRoutes);

routes.use('/recommendations', recommendationRoutes);

// Rota para buscar usuário por ID
routes.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await database.user.findUnique({
      where: { id },
      include: {
        client: true,
        provider: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    return res.json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

//routes.use(sharedRoutes);
//routes.use('/properties', propertiesRoutes);

routes.use('/ping', async (req: Request, res: Response) => {
  return res.json('PONG - V.0.2')
});

routes.post("/gerencianet/webhook", async (req: Request, res: Response) => {
  console.log("GERENCIANET WEBHOOK", req.query)
  
  let { subscription_gateway_id, transaction_gateway_id }: any = req.query
  transaction_gateway_id = req?.body?.pix?.txid ? req?.body?.pix?.txid : transaction_gateway_id
  transaction_gateway_id = req?.body?.pix?.[0].txid ? req?.body?.pix?.[0].txid : transaction_gateway_id
  
  if (transaction_gateway_id) await importTransactionOfGerencianetService({ transaction_gateway_id })

  else await importSubscriptionOfGerencianetService({ subscription_gateway_id })

  return res.json({ message: "ok" })
})

export { routes };
