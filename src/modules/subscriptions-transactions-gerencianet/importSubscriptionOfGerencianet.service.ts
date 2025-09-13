import { database } from "@/shared/infra/database"
import { generateId } from "@/shared/utils/generateId"
import { getDetailsOfSubscriptionInGerencianet } from "@/shared/utils/gerencianet/subscriptions"
import { afterSaveTransaction } from "@/shared/utils/gerencianet/subscriptions/socket"

interface IImportSubscriptionOfGerencianetService {
    subscription_gateway_id: number,
}

export const importSubscriptionOfGerencianetService = async (props: IImportSubscriptionOfGerencianetService) => {
    let { subscription_gateway_id } = props
    let transaction_id: string | undefined = undefined

    if (!subscription_gateway_id) return { transaction_id }

    const subscription = await database.subscriptions.findFirst({
        where: { gateway_id: Number(subscription_gateway_id) }
    })

    if (!subscription?.id) return { transaction_id }

    const subscription_id = subscription?.id

    const details = await getDetailsOfSubscriptionInGerencianet(subscription_gateway_id)
    const { charges, next_execution, next_expire_at, status, payment_method } = details

    await database.subscriptions.update({
        data: {
            status, next_execution, next_expire_at
        },
        where: { id: subscription.id }
    });

    const provider = await database.provider.findFirst({
        where: { subscription_id }
    })

    for (const charge of charges) {
        const gateway_id = charge.charge_id
        const status = charge.status
        const description = "Pagamento de assinatura"
        const type = "increase"
        const value = subscription?.value
        const provider_id = provider?.id

        const oldTransaction = await database.transactions.findFirst({
            where: { gateway_id }
        })

        transaction_id = oldTransaction?.id

        if (oldTransaction) {
            await database.transactions.update({
                data: {
                    status
                },
                where: { id: oldTransaction.id }
            });
        }
        else {
            const card_flag = subscription?.card_flag
            const card_mask = subscription?.card_mask
            const friendly_id = generateId(6);

            const transaction_data = {subscription_id, friendly_id, gateway_id, status, description, type, value, provider_id, method: payment_method, card_flag, card_mask }

            const new_transaction = await database.transactions.create({
                data: transaction_data
            });

            transaction_id = new_transaction?.id
        }
    }

    afterSaveTransaction({ provider_id: provider?.id })

    return { transaction_id }
}