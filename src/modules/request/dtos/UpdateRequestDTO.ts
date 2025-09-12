import { RequestBudgetStatus, RequestStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface UpdateRequestDTO {
  service_type?: string;
  description?: string;
  address?: string;
  urgency?: string;
  value?: Decimal;
  budget?: Decimal;
  observation?: string;
  status?: RequestStatus;
  budgetStatus?: RequestBudgetStatus;
}
