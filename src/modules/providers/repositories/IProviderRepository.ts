import { CreateProviderDTO, UpdateProviderDTO, ProviderResponseDTO } from '../dtos';

export interface IProviderRepository {
  create(data: CreateProviderDTO): Promise<ProviderResponseDTO>;
  findById(id: string): Promise<ProviderResponseDTO | null>;
  findByUserId(userId: string): Promise<ProviderResponseDTO | null>;
  findAll(): Promise<ProviderResponseDTO[]>;
  update(id: string, data: UpdateProviderDTO): Promise<ProviderResponseDTO>;
  delete(id: string): Promise<void>;
  findByStatus(status: 'PENDING' | 'APPROVED' | 'REJECTED'): Promise<ProviderResponseDTO[]>;
  findByCity(city: string): Promise<ProviderResponseDTO[]>;
  findByService(service: string): Promise<ProviderResponseDTO[]>;
}
