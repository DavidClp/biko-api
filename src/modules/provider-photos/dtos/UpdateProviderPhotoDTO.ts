export interface IUpdateProviderPhotoDTO {
  description?: string;
  order?: number;
}

export class UpdateProviderPhotoDTO implements IUpdateProviderPhotoDTO {
  description?: string;
  order?: number;

  constructor(data: IUpdateProviderPhotoDTO) {
    this.description = data.description;
    this.order = data.order;
  }
}
