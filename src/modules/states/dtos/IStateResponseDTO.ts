export interface IStateResponseDTO {
  id: string;
  name: string | null;
  initials: string | null;
  createdAt: Date;
  updatedAt: Date;
  name_no_accents: string | null;
}
