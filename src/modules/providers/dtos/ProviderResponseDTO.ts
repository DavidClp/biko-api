export interface ProviderResponseDTO {
  id: string;
  userId: string;
  name: string;
  service: string;
  description?: string;
  city: string;
  phone?: string;
  socialLinks?: Record<string, any>;
  photoUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}
