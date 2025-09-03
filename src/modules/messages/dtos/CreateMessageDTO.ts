export interface CreateMessageDTO {
  requestId: string;
  content: string;
  type?: 'TEXT' | 'IMAGE' | 'VIDEO';
}
