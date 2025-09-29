import { IAdminRepository } from '../repositories'
import { IAdminStatsDTO } from '../dtos'

export class GetDashboardStatsUseCase {
  private adminRepository: IAdminRepository

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository
  }

  async execute(): Promise<IAdminStatsDTO> {
    try {
      const stats = await this.adminRepository.getDashboardStats()
      return stats
    } catch (error) {
      console.error('Erro no use case GetDashboardStatsUseCase:', error)
      throw error
    }
  }
}
