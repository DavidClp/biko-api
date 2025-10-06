import { Request, Response } from "express";
import { ResetPasswordUseCase } from "../useCases/ResetPasswordUseCase";

export class ResetPasswordController {
  constructor(private resetPasswordUseCase: ResetPasswordUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { token, newPassword } = request.body;

      if (!token || !newPassword) {
        return response.status(400).json({
          error: "Token e nova senha são obrigatórios",
        });
      }

      await this.resetPasswordUseCase.execute({ token, newPassword });

      return response.status(200).json({
        success: true,
        message: "Senha redefinida com sucesso",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return response.status(400).json({
          error: error.message,
        });
      }

      return response.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}


