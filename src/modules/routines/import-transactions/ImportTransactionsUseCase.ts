import { importTransactionOfGerencianetService } from "@/modules/subscriptions-transactions-gerencianet/importTransactionOfGerencianet.service"
import { database } from "@/shared/infra/database"

export class ImportTransactionsUseCase {
  async execute() {

    const transactions = await database.transactions.findMany({
      where: {
        status: {
          notIn: ["new", "waiting", "link"]
        },
        type: 'increase'
      }
    })

    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i]
      await importTransactionOfGerencianetService({
        transaction_gateway_id: transaction.gateway_id,
      })
    }
  }
}