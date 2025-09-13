import { database } from "../../../../shared/infra/database";
import { IGetListAllDTO } from "../../dtos/IGetListAllDTO";
import { ISubscriptioRepository } from "../ISubscriptioRepository";


export class PrismaSubscriptioRepository implements ISubscriptioRepository  {

  async create(data: any): Promise<any> {
    /* const plan = await database.plans.create({
      data,
    });

    return {
      ...plan,
      permissions: plan?.permissions
    }; */
  }

  async update(data: any): Promise<any> {
 /*    const { id, ...dataUpdate } = data;

    const plan = await database.plans.update({
      where: {
        id,
      },
      data: dataUpdate,
    });

    return plan; */
  }

  async listAll(data: IGetListAllDTO): Promise<any> {
    const { status } = data;

    const result = await database.subscriptions.findMany({
      where: {
        status: {
          in: status,
        },
      },
      include: {
        provider: true
      }
    });

    return result;
  }

  async find(data: {id: string}): Promise<any> {
    const result = await database.subscriptions.findUnique({
      where: {
        id: data.id
      },
    });

    return result;
  }

}
