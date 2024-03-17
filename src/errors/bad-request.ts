import { STATUS_BAD_REQUEST } from '../utils/constants';

class BadRequestError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_BAD_REQUEST;
  }
}

export default BadRequestError;
