import { IAdminRepository } from '../repositories'
import { IAdminAnalyticsDTO, IAdminAnalyticsFiltersDTO } from '../dtos'

export class GetAnalyticsUseCase {
  private adminRepository: IAdminRepository

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository
  }

  async execute(filters: IAdminAnalyticsFiltersDTO): Promise<IAdminAnalyticsDTO> {
    try {
      const analytics = await this.adminRepository.getAnalytics(filters)
      return analytics
    } catch (error) {
      console.error('Erro no use case GetAnalyticsUseCase:', error)
      throw error
    }
  }
}
