export interface UpdateProviderDTO {
  name?: string;
  service?: string;
  description?: string;
  city?: string;
  phone?: string;
  socialLinks?: Record<string, any>;
  photoUrl?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}
