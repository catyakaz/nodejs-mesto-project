import { ErrorWithStatusCode } from '../types';
import { STATUS_ERROR_ID } from '../utils/constants';

class NotFoundError extends Error implements ErrorWithStatusCode {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_ERROR_ID;
  }
}

export default NotFoundError;
