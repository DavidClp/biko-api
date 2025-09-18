import { IProviderReviewRepository } from '../repositories';
import { CreateProviderReviewDTO, ProviderReviewResponseDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class CreateProviderReviewUseCase {
  constructor(private providerReviewRepository: IProviderReviewRepository) {}

  async execute(data: CreateProviderReviewDTO): Promise<ProviderReviewResponseDTO> {
    // Validações
    if (!data.provider_id) {
      throw new AppError('Provider ID é obrigatório', 400);
    }

    if (!data.review || data.review.trim().length === 0) {
      throw new AppError('Review é obrigatório', 400);
    }

    if (!data.stars || data.stars < 1 || data.stars > 5) {
      throw new AppError('Stars deve ser entre 1 e 5', 400);
    }

    const review = await this.providerReviewRepository.create(data);

    return review;
  }
}
