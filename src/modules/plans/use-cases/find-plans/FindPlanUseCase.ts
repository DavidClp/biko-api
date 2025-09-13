import { NotFoundError } from '../../../../shared/errors/NotFoundError';
import { IPlanRepository } from '../../repositories/IPlanRepository';

interface IExecuteFindPlanUseCase {
  id: string;
}

export class FindPlanUseCase {
  constructor(private readonly planRepository: IPlanRepository) {}

  async execute({ id }: IExecuteFindPlanUseCase) {
    const { plan } = await this.validate({ id });

    if(plan?.value) {
      plan.value = plan.value.toFixed(2) as any;
    }

    return plan;
  }

  async validate({ id }: {id: string}) {
    const plan = await this.planRepository.find({ id });
    if (!plan) throw new NotFoundError('plan');

    return { plan };
  }
}
