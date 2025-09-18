import { CreateProviderReviewDTO, ProviderReviewResponseDTO, ListProviderReviewsDTO } from '../dtos';

export interface IProviderReviewRepository {
  create(data: CreateProviderReviewDTO): Promise<ProviderReviewResponseDTO>;
  findByProviderId(params: ListProviderReviewsDTO): Promise<ProviderReviewResponseDTO[]>;
  countByProviderId(providerId: string): Promise<number>;
  findById(id: string): Promise<ProviderReviewResponseDTO | null>;
}
