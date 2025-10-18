import { Router } from 'express';
import { BannerController } from '../controllers';
import { userAuthenticatedMiddleware } from '@/shared/infra/http/express/middlewares/user-authenticated/UserAuthenticatedMiddleware';
import multer from 'multer';

const bannerRoutes = Router();
const bannerController = new BannerController();

// Configuração do multer para upload de imagens
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

bannerRoutes.get('/', userAuthenticatedMiddleware(), bannerController.list.bind(bannerController));

bannerRoutes.get('/position/:position', bannerController.getByPosition.bind(bannerController));

bannerRoutes.get('/:id', userAuthenticatedMiddleware(), bannerController.getById.bind(bannerController));

bannerRoutes.post('/', userAuthenticatedMiddleware(), upload.single('image'), bannerController.create.bind(bannerController));

bannerRoutes.put('/:id', userAuthenticatedMiddleware(), upload.single('image'), bannerController.update.bind(bannerController));

bannerRoutes.delete('/:id', userAuthenticatedMiddleware(), bannerController.delete.bind(bannerController));

bannerRoutes.post('/:id/click', bannerController.incrementClick.bind(bannerController));

bannerRoutes.post('/:id/view', bannerController.incrementView.bind(bannerController));


export { bannerRoutes };
