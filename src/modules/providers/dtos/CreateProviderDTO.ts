export interface CreateProviderDTO {
  userId: string;
  name: string;
  service: string;
  description?: string;
  city: string;
  phone?: string;
  socialLinks?: Record<string, any>;
  photoUrl?: string;
}
