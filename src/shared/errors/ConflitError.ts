import AppError from './AppError';

export class ConflitError extends AppError {
  constructor(resource: string, noUpper = false) {
    super({
      detail: `${noUpper ? resource : resource.toUpperCase()} já existe`,
      title: 'Recurso já existe',
      statusCode: 409,
      origin: 'ConflitError',
      type: 'RequestParamsError',
    });
  }
}
