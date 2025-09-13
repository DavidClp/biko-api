import { gerencianet } from "..";

interface ICreatePixCharge {
    amount: any;
    description: string;
}

export const transform_status_pix_to_transaction: any = {
    "ATIVA": "waiting",
    "CONCLUIDA": "paid",
    "REMOVIDA_PELO_USUARIO_RECEBEDOR": "unpaid",
    "REMOVIDA_PELO_PSP": "unpaid",
}

export const getPixDetailsInGerencianet = async (txid: string) => {
    const details = await gerencianet.pixDetailCharge({ txid })

    return transform_status_pix_to_transaction[details.status]
}