import { IAdminRepository } from '../repositories'
import { IAdminProviderDTO } from '../dtos'

export class GetProviderByIdUseCase {
  private adminRepository: IAdminRepository

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository
  }

  async execute(providerId: string): Promise<IAdminProviderDTO | null> {
    try {
      const provider = await this.adminRepository.getProviderByIdWithDetails(providerId)
      return provider
    } catch (error) {
      console.error('Erro no use case GetProviderByIdUseCase:', error)
      throw error
    }
  }
}
