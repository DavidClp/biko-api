import { IAdminRepository } from '../repositories'
import { IAdminToggleProviderListedDTO } from '../dtos'

export class ToggleProviderListedUseCase {
  private adminRepository: IAdminRepository

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository
  }

  async execute(data: IAdminToggleProviderListedDTO): Promise<void> {
    try {
      await this.adminRepository.toggleProviderListed(data.providerId, data.is_listed)
    } catch (error) {
      console.error('Erro no use case ToggleProviderListedUseCase:', error)
      throw error
    }
  }
}
