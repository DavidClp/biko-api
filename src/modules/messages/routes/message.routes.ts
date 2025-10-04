import { Router } from 'express';
import { MessageController, UploadImageController, GetImageController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';
import multer from 'multer';

const messageRoutes = Router();
const messageController = new MessageController();
const uploadImageController = new UploadImageController();
const getImageController = new GetImageController();

// Configuração do multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

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

// Rota para upload de imagem de mensagem
messageRoutes.post('/upload-image', userAuthenticatedMiddleware(), upload.single('image'), uploadImageController.upload.bind(uploadImageController));

// Rota para acessar imagens de mensagens (com URL assinada)
messageRoutes.get('/image/:requestId/:fileName', userAuthenticatedMiddleware(), getImageController.getImage.bind(getImageController));

export { messageRoutes };
