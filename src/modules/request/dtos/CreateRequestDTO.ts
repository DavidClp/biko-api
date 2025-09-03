export interface CreateRequestDTO {
  clientId: string;
  providerId: string;
  service_type: string;
  description?: string;
  address?: string;
  urgency?: string;
  value?: number;
}
