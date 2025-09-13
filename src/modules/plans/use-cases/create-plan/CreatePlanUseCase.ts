import { ICreatePlanDTO } from "../../dtos/ICreatePlanDTO";
import { IPlanRepository } from "../../repositories/IPlanRepository";
import { cratePlanInGerecianet } from "../../../../shared/utils/gerencianet/plans";

export class CreatePlanUseCase {
  constructor(
    private readonly businessRepository: IPlanRepository,
  ) { }

  async execute(data: ICreatePlanDTO) {
    const planGerencianet = await cratePlanInGerecianet(data);
		data.gateway_id = planGerencianet.data.plan_id;

    await this.businessRepository.create(data);
  }
}
