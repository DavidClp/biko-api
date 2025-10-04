import { Decimal } from "@prisma/client/runtime/library";

export interface RequestResponseDTO {
  id: string;
  clientId: string;
  providerId: string;
  service_type: string;
  description?: string;
  address?: string;
  urgency?: string;
  value?: Decimal;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;  
  unreadMessages?: number;
  client?: {
    userId: string;
  };
  provider?: {
    userId: string;
  };
}
