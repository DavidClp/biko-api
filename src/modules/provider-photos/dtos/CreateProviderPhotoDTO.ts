export interface ICreateProviderPhotoDTO {
  provider_id: string;
  photo_url: string;
  description?: string;
  order?: number;
}

export class CreateProviderPhotoDTO implements ICreateProviderPhotoDTO {
  provider_id: string;
  photo_url: string;
  description?: string;
  order?: number;

  constructor(data: ICreateProviderPhotoDTO) {
    this.provider_id = data.provider_id;
    this.photo_url = data.photo_url;
    this.description = data.description;
    this.order = data.order || 0;
  }
}
