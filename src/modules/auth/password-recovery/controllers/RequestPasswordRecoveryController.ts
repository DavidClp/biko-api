import { Request, Response } from "express";
import { RequestPasswordRecoveryUseCase } from "../useCases/RequestPasswordRecoveryUseCase";

export class RequestPasswordRecoveryController {
  constructor(
    private requestPasswordRecoveryUseCase: RequestPasswordRecoveryUseCase
  ) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email } = request.body;

      if (!email) {
        return response.status(400).json({
          error: "Email é obrigatório",
        });
      }

      await this.requestPasswordRecoveryUseCase.execute({ email });

      return response.status(200).json({
        success: true,
        message: "Email de recuperação enviado com sucesso",
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


