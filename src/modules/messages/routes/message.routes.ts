import { Router } from 'express';
import { MessageController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';

const messageRoutes = Router();
const messageController = new MessageController();

// Rota para buscar mensagens por requestId
messageRoutes.get('/request/:requestId', userAuthenticatedMiddleware(), messageController.getByRequestId.bind(messageController));

// Rota para buscar mensagens por senderId
messageRoutes.get('/sender/:senderId', userAuthenticatedMiddleware(), messageController.getBySenderId.bind(messageController));

// Rota para buscar mensagens por receiverId
messageRoutes.get('/receiver/:receiverId', userAuthenticatedMiddleware(), messageController.getByReceiverId.bind(messageController));

// Rota para criar uma nova mensagem
messageRoutes.post('/', userAuthenticatedMiddleware(), messageController.create.bind(messageController));

// Rota para atualizar o status de visualização da mensagem
messageRoutes.patch('/:id/viewed', userAuthenticatedMiddleware(), messageController.updateViewed.bind(messageController));

// Rota para deletar uma mensagem
messageRoutes.delete('/:id', userAuthenticatedMiddleware(), messageController.delete.bind(messageController));

export { messageRoutes };
