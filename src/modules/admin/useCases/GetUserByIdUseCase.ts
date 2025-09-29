import { IAdminRepository } from '../repositories/IAdminRepository';

export class GetUserByIdUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(userId: string): Promise<any | null> {
    return this.adminRepository.getUserById(userId);
  }
}
