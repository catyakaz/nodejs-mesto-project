import { NextFunction, Response } from 'express';
import { ErrorWithStatusCode, SessionRequest } from '../types';
import { STATUS_ERROR_SERVER } from '../utils/constants';

export default (
  err: ErrorWithStatusCode,
  _req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = STATUS_ERROR_SERVER, message } = err;

  res.status(statusCode).send({
    message: statusCode === STATUS_ERROR_SERVER ? 'На сервере произошла ошибка' : message,
  });

  next();
};
