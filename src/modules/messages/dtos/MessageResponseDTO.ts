export interface MessageResponseDTO {
  id: string;
  requestId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO';
  viewed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
