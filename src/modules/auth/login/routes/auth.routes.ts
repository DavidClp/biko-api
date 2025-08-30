import { Router } from 'express';
import { AuthenticateUserController } from '../controllers/AuthenticateUserController';
import { AuthenticateUserUseCase } from '../useCases/AuthenticateUserUseCase';
import { AuthenticateUserValidator } from '../validators/AuthenticateUserValidator';

const authRoutes = Router();

const authenticateUserUseCase = new AuthenticateUserUseCase();
const authenticateUserController = new AuthenticateUserController(authenticateUserUseCase);

authRoutes.post('/login', AuthenticateUserValidator.validate, (request, response) => {
  return authenticateUserController.handle(request, response);
});

export { authRoutes };
