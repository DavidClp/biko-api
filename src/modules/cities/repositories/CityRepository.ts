import { PrismaClient, Prisma } from '@prisma/client';
import { ICityRepository } from './ICityRepository';
import { ICityResponseDTO } from '../dtos/ICityResponseDTO';
import { ListCitiesDTO } from '../dtos/ListCitiesDTO';

export class CityRepository implements ICityRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async listCities(params: ListCitiesDTO): Promise<ICityResponseDTO[]> {
    const { search, limit = 20, page = 1 } = params;
    const skip = (page - 1) * limit;

    let where: Prisma.citiesWhereInput = {};

    if (search) {
      // Se há busca, permite buscar em qualquer estado
      where = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { name_no_accents: { contains: search, mode: 'insensitive' } },
        ],
      };
    } else {
      // Se não há busca, filtra apenas cidades de Rondônia
      where = {
        state: {
          OR: [
            { name: { contains: 'Rondônia', mode: 'insensitive' } },
            { name: { contains: 'Rondonia', mode: 'insensitive' } },
            { initials: 'RO' },
          ],
        },
      };
    }

    const cities = await this.prisma.cities.findMany({
      where,
      include: {
        state: {
          select: {
            id: true,
            name: true,
            initials: true,
          },
        },
      },
      take: limit,
      skip,
      orderBy: {
        name: 'asc',
      },
    });

    return cities as ICityResponseDTO[];
  }

  async countCities(params: ListCitiesDTO): Promise<number> {
    const { search } = params;

    let where: Prisma.citiesWhereInput = {};

    if (search) {
      // Se há busca, permite buscar em qualquer estado
      where = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { name_no_accents: { contains: search, mode: 'insensitive' } },
        ],
      };
    } else {
      // Se não há busca, filtra apenas cidades de Rondônia
      where = {
        state: {
          OR: [
            { name: { contains: 'Rondônia', mode: 'insensitive' } },
            { name: { contains: 'Rondonia', mode: 'insensitive' } },
            { initials: 'RO' },
          ],
        },
      };
    }

    return await this.prisma.cities.count({ where });
  }
}
