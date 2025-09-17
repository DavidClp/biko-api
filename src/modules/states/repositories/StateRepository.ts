import { PrismaClient, Prisma } from '@prisma/client';
import { IStateRepository } from './IStateRepository';
import { IStateResponseDTO } from '../dtos/IStateResponseDTO';
import { ListStatesDTO } from '../dtos/ListStatesDTO';

export class StateRepository implements IStateRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async listStates(params: ListStatesDTO): Promise<IStateResponseDTO[]> {
    const { search, limit = 20, page = 1 } = params;
    const skip = (page - 1) * limit;

    let where: Prisma.stateWhereInput = {};

    if (search) {
      where = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { name_no_accents: { contains: search, mode: 'insensitive' } },
          { initials: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const states = await this.prisma.state.findMany({
      where,
      take: limit,
      skip,
      orderBy: {
        name: 'asc',
      },
    });

    return states as IStateResponseDTO[];
  }

  async countStates(params: ListStatesDTO): Promise<number> {
    const { search } = params;

    let where: Prisma.stateWhereInput = {};

    if (search) {
      where = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { name_no_accents: { contains: search, mode: 'insensitive' } },
          { initials: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    return await this.prisma.state.count({ where });
  }
}
