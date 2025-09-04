import { MessageType } from '@prisma/client';

export interface MessageResponseDTO {
  id: string;
  request_id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  type: MessageType;
  viewed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
