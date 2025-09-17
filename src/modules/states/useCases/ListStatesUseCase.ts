import { IStateRepository } from '../repositories/IStateRepository';
import { IStateResponseDTO } from '../dtos/IStateResponseDTO';
import { ListStatesDTO } from '../dtos/ListStatesDTO';

export class ListStatesUseCase {
  constructor(private stateRepository: IStateRepository) {}

  async execute(params: ListStatesDTO): Promise<{
    states: IStateResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, limit = 20, page = 1 } = params;

    const [states, total] = await Promise.all([
      this.stateRepository.listStates({ search, limit, page }),
      this.stateRepository.countStates({ search }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      states,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
