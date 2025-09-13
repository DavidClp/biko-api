import { IPlanDTO } from '../dtos/IPlanDTO';
import { ICreatePlanDTO } from '../dtos/ICreatePlanDTO';
import { IFindPlanDTO } from '../dtos/IFindPlanDTO';
import { IListPlansDTO } from '../dtos/IListPlansDTO';
import { IUpdatePlansDTO } from '../dtos/IUpdatePlansDTO';

export interface IPlanRepository {
  create(data: ICreatePlanDTO): Promise<IPlanDTO>;
  update(data: IUpdatePlansDTO): Promise<IPlanDTO>;
  find(data: IFindPlanDTO): Promise<IPlanDTO | null>;
  list(data: IListPlansDTO): Promise<IPlanDTO[] | null>;
  count(data: IListPlansDTO): Promise<number>;
}
