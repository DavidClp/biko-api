import AppError from "../../../../shared/errors/AppError"
import { database } from "../../../../shared/infra/database"
import { cancelSubscriptionInGerencianet } from "../../../../shared/utils/gerencianet/subscriptions"

interface ICancelSubscriptionService {
    subscription_id: string
}

export const CancelSubscriptionUseCase = async (data: ICancelSubscriptionService) => {
    const { subscription_id } = data

    const subscription = await database.subscriptions.findUnique({
        where: {
            id: subscription_id
        }
    })

    if (!subscription) {
        throw new AppError({
            title: 'Subscription not found',
            detail: 'Subscription not found',
            statusCode: 404,
        });
    }

    const gateway_id = subscription.gateway_id

    if (gateway_id) await cancelSubscriptionInGerencianet(gateway_id)

    await database.subscriptions.update({
        where: {
            id: subscription_id
        },
        data: {
            status: "canceled"
        }
    })

    await database.transactions.updateMany({
        where: {
            subscription_id: subscription_id
        },
        data: {
            status: "canceled"
        }
    })

    return subscription
}