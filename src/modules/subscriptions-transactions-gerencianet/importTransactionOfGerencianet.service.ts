import { database } from "@/shared/infra/database"
import { getDetailsOfBankingBilletChargeInGerencianet } from "@/shared/utils/gerencianet/banking_billet"
import { getDetailsOfCreditCardChargeInGerencianet } from "@/shared/utils/gerencianet/credit_card"
import { getPixDetailsInGerencianet } from "@/shared/utils/gerencianet/pix"

interface IImportTransactionOfGerencianetService {
    transaction_gateway_id: any
}

const diffInSeconds = (date1: Date, date2: Date) => {
    const diff = Math.abs(date1.getTime() - date2.getTime())
    return diff / 1000
}

export const importTransactionOfGerencianetService = async (props: IImportTransactionOfGerencianetService) => {
    const { transaction_gateway_id } = props

    if (transaction_gateway_id) {
        const transaction_in_db = await database.transactions.findFirst({
            where: { gateway_id: transaction_gateway_id },
        })

        if (transaction_in_db?.id) {
            if (transaction_in_db?.method === "pix") {
                try {
                    let charge_status = await getPixDetailsInGerencianet(transaction_gateway_id)

                    const createdAt = new Date(transaction_in_db.createdAt as any)
                    const difference = diffInSeconds(createdAt, new Date())
                    if (difference > 3600 && charge_status === "waiting") charge_status = "expired";

                    let data_payment = transaction_in_db?.data_payment;

                    if (!data_payment) {
                        charge_status?.data?.history?.forEach((item: { message: string, created_at: string }) => {
                            if (item?.message?.includes("Pagamento de R$") && item?.message?.includes("efetuado em")) {
                                data_payment = new Date(item?.created_at);
                            }
                        })
                    }

                    await database.transactions.update({
                        data: {
                            status: charge_status,
                            data_payment: data_payment
                        },
                        where: {
                            id: transaction_in_db.id
                        }
                    })
                } catch (err) { console.log(err) }
            }
            else if (transaction_in_db?.method === "credit_card") {
                try {
                    const details = await getDetailsOfCreditCardChargeInGerencianet(transaction_gateway_id)

                    let data_payment = transaction_in_db?.data_payment;

                    if (!data_payment) {
                        details?.data?.history?.forEach((item: { message: string, created_at: string }) => {
                            if (item?.message?.includes("Pagamento de R$") && item?.message?.includes("efetuado em")) {
                                data_payment = new Date(item?.created_at);
                            }
                        })
                    }

                    await database.transactions.update({
                        data: {
                            status: details?.data?.status,
                            data_payment: data_payment
                        },
                        where: {
                            id: transaction_in_db.id
                        }
                    })
                } catch (err) { console.log(err) }
            }
            else {
                try {
                    const details = await getDetailsOfBankingBilletChargeInGerencianet(transaction_gateway_id)

                    let expire_at = details?.data?.payment?.banking_billet?.expire_at

                    if (expire_at) {
                        expire_at = new Date(expire_at)
                        expire_at.setHours(expire_at.getHours() + 3)
                        expire_at = expire_at.toISOString()
                    }

                    expire_at = expire_at ? expire_at : transaction_in_db.createdAt;

                    let data_payment = transaction_in_db?.data_payment;

                    if (!data_payment) {
                        details?.data?.history?.forEach((item: { message: string, created_at: string }) => {
                            if (item?.message?.includes("Pagamento de R$") && item?.message?.includes("efetuado em")) {
                                data_payment = new Date(item?.created_at);
                            }
                        })
                    }

                    await database.transactions.update({
                        data: {
                            status: details?.data?.status,
                            data_payment: data_payment
                        },
                        where: {
                            id: transaction_in_db.id
                        }
                    })

                    await database.$queryRawUnsafe(`UPDATE transactions SET "createdAt" = '${expire_at}' WHERE id = '${transaction_in_db.id}'`)

                } catch (err) {
                    console.log("ERROR 'importTransactionOfGerencianetService' outros", err)
                }
            }
        }
    }
}
