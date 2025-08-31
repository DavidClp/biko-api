export interface UpdateProviderDTO {
  name?: string;
  service?: string;
  description?: string;
  cityId?: string;
  phone?: string;
  socialLinks?: Record<string, any>;
  photoUrl?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}
