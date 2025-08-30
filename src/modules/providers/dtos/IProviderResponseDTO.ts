export interface IProviderResponseDTO {
  id: string;
  userId: string;
  name: string;
  service: string;
  city?: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}