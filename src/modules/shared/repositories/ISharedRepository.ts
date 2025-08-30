import { ICreateUser, IUser } from "../dtos/IUser";

export interface ISharedRepository {
  createUser(data: ICreateUser): Promise<IUser>;
  updateProviderOfUSer({providerId, userId}: {providerId: string, userId: string}): Promise<void>;
  updateClientOfUSer({clientId, userId}: {clientId: string, userId: string}): Promise<void>;
  findUserByEmail({ email }: { email: string }): Promise<IUser>;
}
