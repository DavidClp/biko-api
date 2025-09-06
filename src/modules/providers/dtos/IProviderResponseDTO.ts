import { ProviderStatus } from "@prisma/client";

export interface IProviderResponseDTO {
  id: string;
  userId: string;
  name: string;
  services: string[];
  description?: string;
  photoUrl?: string;
  city?: string;
  phone?: string;
  status: ProviderStatus;
  createdAt: Date;
  updatedAt: Date;
}