import {
  Router, NextFunction, Request, Response,
} from 'express';
import NotFoundError from '../errors/not-found';

const router = Router();

export default router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
