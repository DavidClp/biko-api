import { database } from "../../../../shared/infra/database";
import { IPlanDTO } from "../../dtos/IPlanDTO";
import { ICreatePlanDTO } from "../../dtos/ICreatePlanDTO";
import { IPlanRepository } from '../IPlanRepository';
import { IUpdatePlansDTO } from "../../dtos/IUpdatePlansDTO";
import { IFindPlanDTO } from "../../dtos/IFindPlanDTO";
import { IListPlansDTO } from "../../dtos/IListPlansDTO";

export class PrismaPlanRepository implements IPlanRepository {

  async create(data: ICreatePlanDTO): Promise<IPlanDTO> {
    const plan = await database.plans.create({
      data,
    });

    return {
      ...plan,
      permissions: plan?.permissions
    };
  }

  async update(data: IUpdatePlansDTO): Promise<IPlanDTO> {
    const { id, ...dataUpdate } = data;

    const plan = await database.plans.update({
      where: {
        id,
      },
      data: dataUpdate,
    });


    return plan;
  }

  async find({ id }: IFindPlanDTO): Promise<IPlanDTO | null> {
    const plan = await database.plans.findFirst({
      where: {
        id,
      },
    });

    return plan;
  }

  async list({ limit, page, search }: IListPlansDTO): Promise<IPlanDTO[] | null> {
    const offset = limit && page ? (Number(page) - 1) * Number(limit) : undefined;

    const plans = await database.plans.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
      orderBy: {
        value: 'asc',
      },
      ...(limit && page ? {
        skip: offset,
        take: Number(limit)
      } : {}),
    });

    return plans;
  }

  async count({ search }: IListPlansDTO) {
    return database.plans.count({
      where: {
        name: { contains: search, mode: 'insensitive' },
      }
    });
  }
}
