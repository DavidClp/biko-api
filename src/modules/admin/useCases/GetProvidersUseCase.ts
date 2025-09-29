import { IAdminRepository } from '../repositories'
import { IAdminProviderDTO, IAdminProviderFiltersDTO } from '../dtos'

export class GetProvidersUseCase {
  private adminRepository: IAdminRepository

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository
  }

  async execute(filters?: IAdminProviderFiltersDTO): Promise<IAdminProviderDTO[]> {
    try {
      const providers = await this.adminRepository.getProvidersWithDetails(filters)
      return providers
    } catch (error) {
      console.error('Erro no use case GetProvidersUseCase:', error)
      throw error
    }
  }
}
