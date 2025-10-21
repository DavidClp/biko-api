import { PrismaClient, Advertiser } from '@prisma/client';
import { CreateAdvertiserDTO, UpdateAdvertiserDTO } from '../dtos';

const prisma = new PrismaClient();

export class AdvertiserRepository {
  async create(data: CreateAdvertiserDTO): Promise<Advertiser> {
    const createData: any = {
      name: data.name,
    };
    
    if (data.email) createData.email = data.email;
    if (data.phone) createData.phone = data.phone;
    if (data.company) createData.company = data.company;
    if (data.description) createData.description = data.description;

    return await prisma.advertiser.create({
      data: createData,
    });
  }

  async findById(id: string): Promise<Advertiser | null> {
    return await prisma.advertiser.findUnique({
      where: { id },
      include: {
        banners: true,
      },
    });
  }

  async findAll(): Promise<Advertiser[]> {
    return await prisma.advertiser.findMany({
      include: {
        banners: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        deletedAt: null
      }
    });
  }

  async update(id: string, data: UpdateAdvertiserDTO): Promise<Advertiser> {
    return await prisma.advertiser.update({
      where: { id },
      data,
      include: {
        banners: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.advertiser.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
