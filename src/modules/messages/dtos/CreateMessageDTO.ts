import { MessageType } from '@prisma/client';

export interface CreateMessageDTO {
  request_id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  type?: MessageType;
}
