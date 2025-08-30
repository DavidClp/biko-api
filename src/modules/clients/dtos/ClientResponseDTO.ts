export interface ClientResponseDTO {
  id: string;
  userId: string;
  name: string;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}
