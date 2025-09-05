import { IServiceResponseDTO } from './IServiceResponseDTO';

export class ServiceResponseDTO implements IServiceResponseDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(service: IServiceResponseDTO) {
    this.id = service.id;
    this.name = service.name;
    this.createdAt = service.createdAt;
    this.updatedAt = service.updatedAt;
  }
}
