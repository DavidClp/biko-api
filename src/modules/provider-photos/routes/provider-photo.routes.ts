import { Router } from 'express';
import { ProviderPhotoController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';
import multer from 'multer';

const providerPhotoRoutes = Router();
const providerPhotoController = new ProviderPhotoController();

const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Criar nova foto
providerPhotoRoutes.post(
  '/:providerId', 
  userAuthenticatedMiddleware(), 
  upload.single('photo'), 
  providerPhotoController.create.bind(providerPhotoController)
);

// Listar fotos do profissional
providerPhotoRoutes.get(
  '/:providerId', 
  providerPhotoController.list.bind(providerPhotoController)
);

// Obter foto específica
providerPhotoRoutes.get(
  '/photo/:photoId', 
  providerPhotoController.getById.bind(providerPhotoController)
);

// Atualizar foto
providerPhotoRoutes.put(
  '/:photoId', 
  userAuthenticatedMiddleware(), 
  providerPhotoController.update.bind(providerPhotoController)
);

// Deletar foto
providerPhotoRoutes.delete(
  '/:photoId', 
  userAuthenticatedMiddleware(), 
  providerPhotoController.delete.bind(providerPhotoController)
);

export { providerPhotoRoutes };
