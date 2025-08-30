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

    if (typeof email !== 'string') {
      return response.status(400).json({
        error: 'Email deve ser uma string'
      });
    }

    if (typeof password !== 'string') {
      return response.status(400).json({
        error: 'Senha deve ser uma string'
      });
    }

    if (password.length < 6) {
      return response.status(400).json({
        error: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({
        error: 'Formato de email inválido'
      });
    }

    return next();
  }
}
