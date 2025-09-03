import { Request, Response } from 'express';
import {
  CreateMessageUseCase,
  GetMessagesByRequestIdUseCase,
  UpdateMessageViewedUseCase,
  DeleteMessageUseCase,
} from '../useCases';
import { MessageRepository } from '../repositories';
import { CreateMessageDTO, UpdateMessageViewedDTO } from '../dtos';
import AppError from '../../../shared/errors/AppError';

export class MessageController {
  private createMessageUseCase: CreateMessageUseCase;
  private getMessagesByRequestIdUseCase: GetMessagesByRequestIdUseCase;
  private updateMessageViewedUseCase: UpdateMessageViewedUseCase;
  private deleteMessageUseCase: DeleteMessageUseCase;

  constructor() {
    const messageRepository = new MessageRepository();

    this.createMessageUseCase = new CreateMessageUseCase(messageRepository);
    this.getMessagesByRequestIdUseCase = new GetMessagesByRequestIdUseCase(messageRepository);
    this.updateMessageViewedUseCase = new UpdateMessageViewedUseCase(messageRepository);
    this.deleteMessageUseCase = new DeleteMessageUseCase(messageRepository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateMessageDTO = req.body;
      const message = await this.createMessageUseCase.execute(data);

      return res.status(201).json({
        success: true,
        data: message,
        message: 'Mensagem criada com sucesso',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          error: error.error,
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }

  async getByRequestId(req: Request, res: Response): Promise<Response> {
    try {
      const { requestId } = req.params;
      const messages = await this.getMessagesByRequestIdUseCase.execute(requestId);

      return res.status(200).json({
        success: true,
        data: messages,
        count: messages.length,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          error: error.error,
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }

  async updateViewed(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const data: UpdateMessageViewedDTO = req.body;
      const message = await this.updateMessageViewedUseCase.execute(id, data);

      return res.status(200).json({
        success: true,
        data: message,
        message: 'Status de visualização atualizado com sucesso',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          error: error.error,
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.deleteMessageUseCase.execute(id);

      return res.status(200).json({
        success: true,
        message: 'Mensagem deletada com sucesso',
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.error.statusCode).json({
          success: false,
          error: error.error,
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          title: 'Erro interno do servidor',
          detail: 'Ocorreu um erro inesperado',
          statusCode: 500,
        },
      });
    }
  }
}
