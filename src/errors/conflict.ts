import { STATUS_CONFLICT_ERROR } from '../utils/constants';

class ConflictError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CONFLICT_ERROR;
  }
}

export default ConflictError;
