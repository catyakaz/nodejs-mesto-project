import { STATUS_UNAUTHORIZED_ERROR } from '../utils/constants';

class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_UNAUTHORIZED_ERROR;
  }
}

export default UnauthorizedError;
