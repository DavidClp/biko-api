export interface IProviderPhotoResponseDTO {
  id: string;
  provider_id: string;
  photo_url: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ProviderPhotoResponseDTO implements IProviderPhotoResponseDTO {
  id: string;
  provider_id: string;
  photo_url: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IProviderPhotoResponseDTO) {
    this.id = data.id;
    this.provider_id = data.provider_id;
    this.photo_url = data.photo_url;
    this.description = data.description;
    this.order = data.order;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
