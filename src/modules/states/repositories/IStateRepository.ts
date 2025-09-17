import { IStateResponseDTO } from '../dtos/IStateResponseDTO';
import { ListStatesDTO } from '../dtos/ListStatesDTO';

export interface IStateRepository {
  listStates(params: ListStatesDTO): Promise<IStateResponseDTO[]>;
  countStates(params: ListStatesDTO): Promise<number>;
}
