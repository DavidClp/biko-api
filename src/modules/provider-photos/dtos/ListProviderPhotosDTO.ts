export interface IListProviderPhotosDTO {
  provider_id: string;
  page?: number;
  limit?: number;
}

export class ListProviderPhotosDTO implements IListProviderPhotosDTO {
  provider_id: string;
  page: number;
  limit: number;

  constructor(data: IListProviderPhotosDTO) {
    this.provider_id = data.provider_id;
    this.page = data.page || 1;
    this.limit = data.limit || 10;
  }
}
