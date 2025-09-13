
import { IUpdatePlansDTO } from "../../dtos/IUpdatePlansDTO";
import { IPlanRepository } from "../../repositories/IPlanRepository";

export class UpdatePlanUseCase {
  constructor(
    private readonly plansRepository: IPlanRepository,
  ) { }

  async execute(data: IUpdatePlansDTO) {
    await this.plansRepository.update(data);
  }
}
