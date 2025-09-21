export interface ProviderResponseDTO {
  id: string;
  userId: string;
  name: string;
  services: string[];
  servicesNames?: string[];
  description?: string;
  cityId?: string;
  cityName?: string;
  phone?: string;
  socialLinks?: Record<string, any>;
  photoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  subscription_id?: string;
  subscription_situation: string
}
