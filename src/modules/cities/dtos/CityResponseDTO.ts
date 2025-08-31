import { ICityResponseDTO } from './ICityResponseDTO';

export class CityResponseDTO implements ICityResponseDTO {
  id: string;
  name: string | null;
  state_id: string;
  createdAt: Date;
  updatedAt: Date;
  name_no_accents: string | null;
  state?: {
    id: string;
    name: string | null;
    initials: string | null;
  };

  constructor(data: ICityResponseDTO) {
    this.id = data.id;
    this.name = data.name;
    this.state_id = data.state_id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.name_no_accents = data.name_no_accents;
    this.state = data.state;
  }
}
