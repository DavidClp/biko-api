import { database } from "../../../../shared/infra/database";
import { gerencianet } from "../../../../shared/utils/gerencianet";

export const GetTransactionsByIdUseCase = async (id: string) => {
	const transaction = await database.transactions.findFirst(({
		where: {
			id,
		},
		include: {
			subscriptions: {
				include: {
					plans: true
				}
			}
		}
	}))


	if (transaction?.method === "pix" && transaction.status === "waiting") {
		const { loc: { id } } = await gerencianet.pixDetailCharge({ txid: transaction?.gateway_id })
		const pix_result = await gerencianet.pixGenerateQRCode({ id })
		const qrcode_copy_and_paste = pix_result.qrcode
		const qrcode = pix_result.imagemQrcode

		return { ...transaction, qrcode_copy_and_paste, qrcode }
	} else if (transaction?.method === "banking_billet" && transaction.status !== "paid") {
		const { data: { payment: { banking_billet } } } = await gerencianet.detailCharge({ id: transaction?.gateway_id })

		const { link, barcode, billet_link, pdf: { charge }, pix } = banking_billet

		const qrcode_copy_and_paste = pix?.qrcode
		const qrcode = pix?.qrcode_image

		return { ...transaction, link, barcode, billet_link, charge, qrcode_copy_and_paste, qrcode }
	}

	return transaction
}