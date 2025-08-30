import AppError from './AppError';

export class UnauthorizedError extends AppError {
  constructor() {
    super({
      detail: 'Acesso negado',
      statusCode: 401,
      title: 'Acesso negado',
    });
  }
}
