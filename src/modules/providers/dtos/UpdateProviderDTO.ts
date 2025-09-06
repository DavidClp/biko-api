import { ProviderStatus } from "@prisma/client";

export interface UpdateProviderDTO {
  name?: string;
  service?: string;
  description?: string;
  cityId?: string;
  phone?: string;
  photoUrl?: string;
  status?: ProviderStatus;
  services?: string[];
  is_listed?: boolean;
}
