import { gerencianet } from "../index";
import { IBankingBillet } from "../IPaymentGatewayHelper";

interface ICreateBankingBilletChargeIInGerencianet {
    amount: any;
    banking_billet: IBankingBillet
}

export const createBankingBilletChargeIInGerencianet = async (data: ICreateBankingBilletChargeIInGerencianet) => {
    const { amount, banking_billet } = data

    const value = Number.parseInt(Number.parseFloat(`${amount}`).toFixed(2).replace(".", ""))

    const result = await gerencianet.createOneStepCharge({}, {
        payment: { banking_billet },
        items: [{ name: "Compra de créditos", value, amount: 1 }]
    })

    const notification_url = `${process.env.WEBHOOK_URL}gerencianet/webhook?transaction_gateway_id=${result?.data?.charge_id}`

    await gerencianet.updateChargeMetadata({ id: result?.data?.charge_id }, { notification_url })

    return result
}

export const getDetailsOfBankingBilletChargeInGerencianet = async (id: string) => {
    const details = await gerencianet.detailCharge({ id })
    return details
}