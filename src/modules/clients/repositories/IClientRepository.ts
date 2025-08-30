import { CreateClientDTO, UpdateClientDTO, ClientResponseDTO } from '../dtos';
import { IClientResponseDTO } from '../dtos/IClientResponseDTO';

export interface IClientRepository {
  create(data: CreateClientDTO): Promise<IClientResponseDTO>;
  findById(id: string): Promise<ClientResponseDTO | null>;
  findByUserId(userId: string): Promise<ClientResponseDTO | null>;
  findAll(): Promise<ClientResponseDTO[]>;
  update(id: string, data: UpdateClientDTO): Promise<ClientResponseDTO>;
  delete(id: string): Promise<void>;
  findByCity(city: string): Promise<ClientResponseDTO[]>;
}
