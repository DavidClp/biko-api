import { ICreateUser } from "@/modules/shared/dtos/IUser";

export interface CreateProviderDTO extends ICreateUser {
  userId: string;
  name: string;
  service: string;
  description?: string;
  city: string;
  phone?: string;
  socialLinks?: Record<string, any>;
  photoUrl?: string;
}
