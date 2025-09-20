import { gerencianet } from ".."
import { PrismaPlanRepository } from "../../../../modules/plans/repositories/implementations/PrismaPlanRepository"
import AppError from "../../../errors/AppError"
import { IBankingBillet, ICreditCard } from "../IPaymentGatewayHelper"

interface ICreateSubscriptionInGerencianet {
    plan_id: string
    totalValueforSubscription: number
    credit_card?: ICreditCard
    banking_billet?: IBankingBillet
}

export const createSubscriptionInGerencianet = async (data: ICreateSubscriptionInGerencianet) => {
    try {
        const { plan_id, totalValueforSubscription } = data
        const { credit_card, banking_billet } = data

        let _credit_card: ICreditCard | undefined = undefined
        let _banking_billet: IBankingBillet | undefined = undefined

        if (credit_card?.payment_token) {
            _credit_card = { ...credit_card, card_mask: undefined, card_flag: undefined }
        }
        else {
            _banking_billet = banking_billet;
        }

        const planRepository = new PrismaPlanRepository();
        const plan = await planRepository.find({ id: plan_id });

        if (!plan?.gateway_id) {
            throw new AppError({
                title: 'Plan not found',
                detail: 'Plan not found',
                statusCode: 404,
            });
        }

        const { gateway_id } = plan

        const name = plan.name
        const value = Number.parseInt(Number.parseFloat(`${totalValueforSubscription}`).toFixed(2).replace(".", ""))

        const _data = { items: [{ name, value, amount: 1 }], payment: {} }

        if (_credit_card) {
            _data.payment = { credit_card: _credit_card }
        } else {
            _data.payment = { banking_billet: _banking_billet }
        }

        const result = await gerencianet.oneStepSubscription({ id: gateway_id }, _data)


        /// criar rota
        const notification_url = `${process.env.WEBHOOK_URL}gerencianet/webhook?subscription_gateway_id=${result?.data?.subscription_id}`

        await gerencianet.updateSubscriptionMetadata({ id: result?.data?.subscription_id }, { notification_url })

        const { subscription_id, status } = result.data

        return { gateway_id: subscription_id, status }
    } catch (err: any) {
        const error_message = err?.error_description || err?.message || "Erro ao criar assinatura"
        throw new AppError({
            title: error_message,
            detail: error_message,
            statusCode: 400,
        })
    }
}

export const getDetailsOfSubscriptionInGerencianet = async (subscription_id: any) => {
    try {
        const result = await gerencianet.detailSubscription({ id: Number.parseInt(`${Number(subscription_id)}`) })

        const data = result?.data

        const charges = getChargesOfSubscriptionInGerencianet(data)

        const next_execution = data.next_execution

        const next_expire_at = data.next_expire_at

        const payment_method = data.payment_method

        return { charges, status: data.status, next_execution, next_expire_at, payment_method }
    } catch (err: any) {
        console.log(err)
        const error_message = err?.error_description || err?.message || "Erro ao obter detalhes da assinatura"
        throw new AppError({
            title: error_message,
            detail: error_message,
            statusCode: 400,
        });
    }
}

export const getChargesOfSubscriptionInGerencianet = (details: any) => {
    const last_charge = details.history.sort((a: any, b: any) => {
        const date_a = new Date(a.created_at)
        const date_b = new Date(b.created_at)
        return date_a.getTime() < date_b.getTime() ? 1 : -1
    }).filter((item: any) => !!item.charge_id)

    return last_charge
}

export const cancelSubscriptionInGerencianet = async (subscription_id: any) => {
    try {
        const result = await gerencianet.cancelSubscription({ id: subscription_id })
        return result
    } catch (err: any) {
        const error_message = err?.error_description || err?.message || "Erro ao cancelar assinatura"
        throw new AppError({
            title: error_message,
            detail: error_message,
            statusCode: 400,
        });
    }
}