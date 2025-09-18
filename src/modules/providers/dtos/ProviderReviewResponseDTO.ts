export interface ProviderReviewResponseDTO {
  id: string;
  provider_id: string;
  review?: string | null;
  stars: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
