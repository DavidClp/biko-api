import { Decimal } from "@prisma/client/runtime/library";

export interface SendBudgetRequestDTO {
  budget: Decimal;
  observation: string;
}
