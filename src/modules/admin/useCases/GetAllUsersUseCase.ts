import { IAdminRepository } from '../repositories/IAdminRepository';

export class GetAllUsersUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(): Promise<any[]> {
    return this.adminRepository.getAllUsers();
  }
}