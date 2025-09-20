import { Request, Response, NextFunction } from 'express';

export class AuthenticateUserValidator {
  static validate(request: Request, response: Response, next: NextFunction): Response | void {
    const { email, password } = request.body;

    if (!email) {
      return response.status(400).json({
        error: 'Email é obrigatório'
      });
    }

    if (!password) {
      return response.status(400).json({
        error: 'Senha é obrigatória'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({
        error: 'Formato de email inválido'
      });
    }

    return next();
  }
}
