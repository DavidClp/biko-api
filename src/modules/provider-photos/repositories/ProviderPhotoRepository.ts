import { database } from '../../../shared/infra/database';
import { ICreateProviderPhotoDTO, IUpdateProviderPhotoDTO, IListProviderPhotosDTO } from '../dtos';

export interface IProviderPhotoRepository {
  create(data: ICreateProviderPhotoDTO): Promise<any>;
  findById(id: string): Promise<any | null>;
  findByProviderId(providerId: string): Promise<any[]>;
  list(data: IListProviderPhotosDTO): Promise<{ data: any[]; pagination: any }>;
  update(id: string, data: IUpdateProviderPhotoDTO): Promise<any>;
  delete(id: string): Promise<void>;
  countByProviderId(providerId: string): Promise<number>;
}

export class ProviderPhotoRepository implements IProviderPhotoRepository {

  async create(data: ICreateProviderPhotoDTO) {
    return await database.providerPhotos.create({
      data: {
        provider_id: data.provider_id,
        photo_url: data.photo_url,
        description: data.description,
        order: data.order || 0,
      },
    });
  }

  async findById(id: string) {
    return await database.providerPhotos.findUnique({
      where: { id },
    });
  }

  async findByProviderId(providerId: string) {
    return await database.providerPhotos.findMany({
      where: { provider_id: providerId },
      orderBy: { order: 'asc' },
    });
  }

  async list(data: IListProviderPhotosDTO) {
    const skip = (data.page - 1) * data.limit;
    
    const [photos, total] = await Promise.all([
      database.providerPhotos.findMany({
        where: { provider_id: data.provider_id },
        orderBy: { order: 'asc' },
        skip,
        take: data.limit,
      }),
      database.providerPhotos.count({
        where: { provider_id: data.provider_id },
      }),
    ]);

    const totalPages = Math.ceil(total / data.limit);

    return {
      data: photos,
      pagination: {
        page: data.page,
        limit: data.limit,
        total,
        totalPages,
      },
    };
  }

  async update(id: string, data: IUpdateProviderPhotoDTO) {
    return await database.providerPhotos.update({
      where: { id },
      data: {
        description: data.description,
        order: data.order,
      },
    });
  }

  async delete(id: string) {
    await database.providerPhotos.delete({
      where: { id },
    });
  }

  async countByProviderId(providerId: string) {
    return await database.providerPhotos.count({
      where: { provider_id: providerId },
    });
  }
}
