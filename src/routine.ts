import { ImportSubscriptionsUseCase } from "./modules/routines/import-subscriptions/ImportSubscriptionsUseCase";
import { ImportTransactionsUseCase } from "./modules/routines/import-transactions/ImportTransactionsUseCase";

export class RoutineTrigger {
  private static ONE_SECOND = 1000;
  private static ONE_MINUTE = 1000 * 60;
  private static TEN_MINUTES = 1000 * 60 * 10;
  private static ONE_HOUR = 1000 * 60 * 60;
  private static ONE_DAY = 1000 * 60 * 60 * 24;
  private static CAN_EXECUTE = process.env.EXECUTE_ROUTINES;

  private static importSubscriptionsUseCase = new ImportSubscriptionsUseCase();

  private static importTransactionsUseCase = new ImportTransactionsUseCase()

  static async execute(): Promise<void> {
    await Promise.all([
      this.executeImportSubscriptions(),
      this.executeImportTransactions(),
    ]);
  }

  private static async executeImportSubscriptions(): Promise<void> {
    while (this.CAN_EXECUTE) {
      try {
        console.log("EXECUTING ROUTINE: 'executeImportSubscriptions'");
        await this.importSubscriptionsUseCase.execute();
      } catch (err) {
        console.log("ERROR ROUTINE: 'executeImportSubscriptions' =>", err);
      }

      await new Promise((resolve) => setTimeout(resolve, this.ONE_MINUTE * 10));
    }
  }

  private static async executeImportTransactions(): Promise<void> {
    while (this.CAN_EXECUTE) {
      try {
        console.log("EXECUTING ROUTINE: 'executeImportTransactions'");
        await this.importTransactionsUseCase.execute();
      } catch (err) {
        console.log("ERROR ROUTINE: 'executeImportTransactions' =>", err);
      }
      await new Promise((resolve) => setTimeout(resolve, this.ONE_MINUTE * 10));
    }
  }

}
