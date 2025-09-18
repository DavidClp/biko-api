import { database } from '../../../shared/infra/database';
import { IProviderReviewRepository } from './IProviderReviewRepository';
import { CreateProviderReviewDTO, ProviderReviewResponseDTO, ListProviderReviewsDTO } from '../dtos';

export class ProviderReviewRepository implements IProviderReviewRepository {

  async create(data: CreateProviderReviewDTO): Promise<ProviderReviewResponseDTO> {
    const review = await database.provider_reviews.create({
      data: {
        provider_id: data.provider_id,
        review: data.review,
        stars: data.stars,
      },
    });

    return {
      id: review.id,
      provider_id: review.provider_id,
      review: review.review,
      stars: review.stars,
      status: review.status,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async findByProviderId(params: ListProviderReviewsDTO): Promise<ProviderReviewResponseDTO[]> {
    const { providerId, limit = 10, page = 1 } = params;
    const skip = (page - 1) * limit;

    const reviews = await database.provider_reviews.findMany({
      where: {
        provider_id: providerId,
       //  status: 'APPROVED', // Apenas reviews aprovados
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip,
    });

    return reviews.map(review => ({
      id: review.id,
      provider_id: review.provider_id,
      review: review.review,
      stars: review.stars,
      status: review.status,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));
  }

  async countByProviderId(providerId: string): Promise<number> {
    return await database.provider_reviews.count({
      where: {
        provider_id: providerId,
       //  status: 'APPROVED', // Apenas reviews aprovados
      },
    });
  }

  async findById(id: string): Promise<ProviderReviewResponseDTO | null> {
    const review = await database.provider_reviews.findUnique({
      where: { id },
    });

    if (!review) {
      return null;
    }

    return {
      id: review.id,
      provider_id: review.provider_id,
      review: review.review,
      stars: review.stars,
      status: review.status,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}
