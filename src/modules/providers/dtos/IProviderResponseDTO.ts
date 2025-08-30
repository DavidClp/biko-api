import { ProviderStatus } from "@prisma/client";

export interface IProviderResponseDTO {
  id: string;
  userId: string;
  name: string;
  service: string;
  description?: string;
  photoUrl?: string;
  city?: string;
  phone: string;
  socialLinks?: string;
  status: ProviderStatus;
  createdAt: Date;
  updatedAt: Date;
}