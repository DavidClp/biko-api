import { IProviderReviewRepository } from '../repositories';
import { ProviderReviewResponseDTO, ListProviderReviewsDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class GetProviderReviewsUseCase {
  constructor(private providerReviewRepository: IProviderReviewRepository) {}

  async execute(params: ListProviderReviewsDTO): Promise<{
    reviews: ProviderReviewResponseDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { providerId, limit = 10, page = 1 } = params;

    if (!providerId) {
      throw new AppError({
        title: 'Provider ID é obrigatório',
        detail: 'Provider ID é obrigatório',
        origin: 'GetProviderReviewsUseCase.execute',
        statusCode: 400,
      });
    }

    const [reviews, total] = await Promise.all([
      this.providerReviewRepository.findByProviderId({ providerId, limit, page }),
      this.providerReviewRepository.countByProviderId(providerId),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
