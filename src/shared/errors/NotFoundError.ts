import AppError from './AppError';

export class NotFoundError extends AppError {
  constructor(resource: string, noUpper: boolean = false) {
    super({
      detail: `${noUpper ? resource : resource.toUpperCase()} não encontrado(a)`,
      title: 'Recurso não encontrado',
      statusCode: 404,
      origin: 'NotFoundError',
      type: 'RequestParamsError',
    });
  }
}
