import { ICreateUser } from "@/modules/shared/dtos/IUser";

export interface CreateClientDTO extends ICreateUser {
  userId: string;
  name: string;
  phone?: string;
  city?: string;
}
