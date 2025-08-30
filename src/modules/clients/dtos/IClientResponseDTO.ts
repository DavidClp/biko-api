export interface IClientResponseDTO {
    id: string;
    userId: string;
    name: string;
    city?: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}