import { ICityRepository } from '../repositories/ICityRepository';
import { ICityResponseDTO } from '../dtos/ICityResponseDTO';
import { ListCitiesDTO } from '../dtos/ListCitiesDTO';

export class ListCitiesUseCase {
  constructor(private cityRepository: ICityRepository) {}

  async execute(params: ListCitiesDTO): Promise<{
    cities: ICityResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { search, limit = 20, page = 1 } = params;

    const [cities, total] = await Promise.all([
      this.cityRepository.listCities({ search, limit, page }),
      this.cityRepository.countCities({ search }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      cities,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
