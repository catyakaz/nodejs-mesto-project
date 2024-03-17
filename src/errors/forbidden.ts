import { STATUS_FORBIDDEN_ERROR } from '../utils/constants';

class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_FORBIDDEN_ERROR;
  }
}

export default ForbiddenError;
