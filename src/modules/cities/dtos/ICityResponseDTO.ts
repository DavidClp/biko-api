export interface ICityResponseDTO {
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
}
