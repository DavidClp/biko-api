import { RecommendationRepository } from '../repositories';

export class GetAllRecommendationsUseCase {
  constructor(private recommendationRepository: RecommendationRepository) {}

  async execute(page: number = 1, limit: number = 20, startDate?: Date, endDate?: Date) {
    return await this.recommendationRepository.getAllRecommendations(page, limit, startDate, endDate);
  }
}
