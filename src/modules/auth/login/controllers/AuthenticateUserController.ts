import { Request, Response } from 'express';
import { AuthenticateUserUseCase } from '../useCases/AuthenticateUserUseCase';

export class AuthenticateUserController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return response.status(400).json({
          error: 'Email e senha são obrigatórios'
        });
      }

      const result = await this.authenticateUserUseCase.execute({
        email,
        password
      });

      return response.status(200).json({
        success: true,
        data: result,
        message: 'Usuário autenticado com sucesso',
      });
    } catch (error) {
      if (error instanceof Error) {
        return response.status(401).json({
          error: error.message
        });
      }

      return response.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}
