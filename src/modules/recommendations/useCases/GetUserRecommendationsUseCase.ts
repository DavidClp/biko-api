import { RecommendationRepository } from '../repositories';
import AppError from '../../../shared/errors/AppError';

export class GetUserRecommendationsUseCase {
  constructor(private recommendationRepository: RecommendationRepository) {}

  async execute(userId: string) {
    if (!userId) {
      throw new AppError({
        title: 'ID do usuário é obrigatório',
        detail: 'O ID do usuário é obrigatório',
        statusCode: 400,
      });
    }

    const recommendations = await this.recommendationRepository.getUserRecommendations(userId);
    return recommendations;
  }
}
