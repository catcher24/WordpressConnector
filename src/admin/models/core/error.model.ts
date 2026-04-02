export interface ErrorDetailsModel {
  title: string;
  status: number;
  details: string;
  detail: string;
  errors: Record<string, object>;
}

export class ErrorModel extends Error {
  error!: ErrorDetailsModel;
  status?: number;
  statusText?: string;
  url?: string;

  constructor(message?: string) {
    super(message);
    this.name = 'ErrorModel';
  }
}
