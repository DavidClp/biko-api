import { importSubscriptionOfGerencianetService } from '@/modules/subscriptions-transactions-gerencianet/importSubscriptionOfGerencianet.service';
import { database } from '@/shared/infra/database';

export class ImportSubscriptionsUseCase {
  constructor() { }

  async execute() {
    const subscriptions = await database.subscriptions.findMany({
      where: {
        status: "active"
      }
    }) || [];

    for (let i = 0; i < subscriptions?.length; i++) {
      const subscription = subscriptions[i];

      try {
        await importSubscriptionOfGerencianetService({
          subscription_gateway_id: subscription.gateway_id!,
        })
      } catch (err) {
        console.error("ERROR IMPORT SUBSCRIPTION => ", err);
      }
    }
  }
}
