import { IProviderResponseDTO } from "@/modules/providers/dtos/IProviderResponseDTO";

export interface ISubscriptionDTO {
    id: string;
    gateway_id: number;
    user_id: string;
    plan_id: string;
    next_execution: string;
    next_expire_at: string;
    value: number;
    status: 'active' | 'inactive' | 'cancelled';
    startDate: Date;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    provider_id: string;
    provider: IProviderResponseDTO;
    banking_billet_info: IbankingBilletInfo
}

export interface IbankingBilletInfo {
  customer: {
    cpf: string,
    name: string,
    birth: string,
    email: string,
    phone_number: string
  },
}