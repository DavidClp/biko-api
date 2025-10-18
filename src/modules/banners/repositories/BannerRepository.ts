import { PrismaClient, Banner, BannerPosition, BannerSize } from '@prisma/client';
import { CreateBannerDTO, UpdateBannerDTO } from '../dtos';

const prisma = new PrismaClient();

export class BannerRepository {
  async create(data: CreateBannerDTO): Promise<Banner> {
    const createData: any = {
      advertiserId: data.advertiserId,
      title: data.title,
      imageUrl: data.imageUrl!,
      position: data.position,
      size: data.size,
      publicVisibility: data.publicVisibility || 'ALL',
    };

    if (data.description) createData.description = data.description;
    if (data.isActive !== undefined) createData.isActive = data.isActive;

    return await prisma.banner.create({
      data: createData,
      include: {
        advertiser: true,
      },
    });
  }

  async findById(id: string): Promise<Banner | null> {
    return await prisma.banner.findUnique({
      where: { id },
      include: {
        advertiser: true,
      },
    });
  }

  async findAll(): Promise<Banner[]> {
    return await prisma.banner.findMany({
      include: {
        advertiser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByAdvertiserId(advertiserId: string): Promise<Banner[]> {
    return await prisma.banner.findMany({
      where: { advertiserId },
      include: {
        advertiser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByPosition(position: BannerPosition, userRole?: string): Promise<Banner[]> {
    // Construir filtro de visibilidade baseado no role do usuário
    let visibilityFilter: any = {};
    console.log('userRole', userRole);
    if (userRole) {
      // Se há um role específico, mostrar banners para esse role ou para todos
      visibilityFilter = {
        OR: [
          { publicVisibility: 'ALL' },
          { publicVisibility: userRole.toUpperCase() }
        ]
      };
    } else {
      visibilityFilter = { publicVisibility: 'ALL' };
    }

    return await prisma.banner.findMany({
      where: { 
        position,
        isActive: true,
        
        ...visibilityFilter,
      },
      include: {
        advertiser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, data: UpdateBannerDTO): Promise<Banner> {
    return await prisma.banner.update({
      where: { id },
      data: {
        size: data.size,
        description: data.description,
        imageUrl: data.imageUrl!,
        publicVisibility: data.publicVisibility,
        position: data.position,
        title: data.title,
        viewCount: data.viewCount,
        clickCount: data.clickCount,
        //@ts-ignore
        isActive: (data.isActive === 'true' || data.isActive === true)? true : false,
      },
      include: {
        advertiser: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.banner.delete({
      where: { id },
    });
  }

  async incrementClickCount(id: string): Promise<void> {
    await prisma.banner.update({
      where: { id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    await prisma.banner.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }
}
