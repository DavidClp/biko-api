import { IGetListAllDTO } from "../dtos/IGetListAllDTO";
import { ISubscriptionDTO } from "../dtos/ISubscriptionDTO";

export interface ISubscriptioRepository {
  create(data: any): Promise<any>;
  update(data: any): Promise<any>;
  find(data: {id: string}): Promise<ISubscriptionDTO>;
  listAll(data: IGetListAllDTO): Promise<ISubscriptionDTO[] | null>;
}
