import { gerencianet } from "../index";
import { ICreditCard } from "../IPaymentGatewayHelper";

interface ICreateCreditCardChargeIInGerencianet {
    amount: any;
    credit_card: ICreditCard
}

export const createCreditCardChargeIInGerencianet = async (data: ICreateCreditCardChargeIInGerencianet) => {
    const { amount, credit_card: { payment_token, customer, billing_address } } = data

    const value = Number.parseInt(Number.parseFloat(`${amount}`).toFixed(2).replace(".", ""))

    const result = await gerencianet.createOneStepCharge({}, {
        payment: { credit_card: { billing_address, payment_token, customer } },
        items: [{ name: "Compra de créditos", value, amount: 1 }]
    })

    const notification_url = `${process.env.WEBHOOK_URL}/gerencianet/webhook?transaction_gateway_id=${result?.data?.charge_id}`

    await gerencianet.updateChargeMetadata({ id: result?.data?.charge_id }, { notification_url })

    return result
}

export const getDetailsOfCreditCardChargeInGerencianet = async (id: string) => {
    const details = await gerencianet.detailCharge({ id })
    return details
}