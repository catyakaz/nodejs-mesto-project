import { Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorized';
import { SessionRequest, IJwtPayload } from '../types';
import { DEFAULT_JWT_SECRET } from '../utils/constants';

const { JWT_SECRET = DEFAULT_JWT_SECRET } = process.env;

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const token = req?.cookies?.jwt;

  if (!token) {
    throw new UnauthorizedError('Токен не передан');
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET) as IJwtPayload;
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
