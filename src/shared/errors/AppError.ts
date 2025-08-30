type IAppErrorTypes = 'AppError' | 'InstanceError' | 'RequestDataError' | 'RequestParamsError';

export interface IErrorPROPS {
  statusCode?: number;
  type?: IAppErrorTypes;
  origin?: string;
  detail: string;
  title: string;
  field?: string;
}

class AppError {
  private detail: string;

  private title: string;

  private statusCode: number;

  private type: IAppErrorTypes;

  private origin?: string;

  private field?: string;

  constructor(props: IErrorPROPS) {
    this.detail = props.detail;
    this.title = props.title;
    this.statusCode = props.statusCode ?? 400;
    this.type = props.type ?? 'AppError';
    this.origin = props?.origin;
    this.field = props.field;
  }

  set setTitle(newTitle: string) {
    this.title = newTitle;
  }

  set setDetail(newDetail: string) {
    this.detail = newDetail;
  }

  set setStatusCode(newStatusCode: number) {
    this.statusCode = newStatusCode;
  }

  get error() {
    return {
      title: this.title,
      detail: this.detail,
      statusCode: this.statusCode,
      type: this.type,
      origin: this.origin,
      field: this.field,
    };
  }
}

export default AppError;
