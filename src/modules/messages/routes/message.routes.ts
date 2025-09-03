import { Router } from 'express';
import { MessageController } from '../controllers';

const messageRoutes = Router();
const messageController = new MessageController();

// Rota para criar uma nova mensagem
messageRoutes.post('/', messageController.create.bind(messageController));

// Rota para buscar mensagens por requestId
messageRoutes.get('/request/:requestId', messageController.getByRequestId.bind(messageController));

// Rota para atualizar o status de visualização da mensagem
messageRoutes.patch('/:id/viewed', messageController.updateViewed.bind(messageController));

// Rota para deletar uma mensagem
messageRoutes.delete('/:id', messageController.delete.bind(messageController));

export { messageRoutes };
