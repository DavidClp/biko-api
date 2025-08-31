import { ICityResponseDTO } from '../dtos/ICityResponseDTO';
import { ListCitiesDTO } from '../dtos/ListCitiesDTO';

export interface ICityRepository {
  listCities(params: ListCitiesDTO): Promise<ICityResponseDTO[]>;
  countCities(params: ListCitiesDTO): Promise<number>;
}
