import { CreateRequestDTO, UpdateRequestDTO, RequestResponseDTO } from '../dtos';

export interface IRequestRepository {
  create(data: CreateRequestDTO): Promise<RequestResponseDTO>;
  findById(id: string): Promise<RequestResponseDTO | null>;
  findAll(): Promise<RequestResponseDTO[]>;
  update(id: string, data: UpdateRequestDTO): Promise<RequestResponseDTO>;
  delete(id: string): Promise<void>;
  findByClientId(clientId: string): Promise<RequestResponseDTO[]>;
  findByProviderId(providerId: string): Promise<RequestResponseDTO[]>;
  findByStatus(status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED'): Promise<RequestResponseDTO[]>;
}
