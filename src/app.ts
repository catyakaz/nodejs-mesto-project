import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import usersRouter from './routes/user';
import cardsRouter from './routes/cards';

import { ErrorWithStatusCode, SessionRequest } from './types';
import {
  DEFAULT_PORT,
  DEFAULT_BASE_PATH,
  STATUS_ERROR_SERVER,
} from './utils/constants';

const { PORT = DEFAULT_PORT, BASE_PATH = DEFAULT_BASE_PATH } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Connected to MongoDB.'))
  .catch(console.log);

app.use((req: SessionRequest, res: Response, next: NextFunction) => {
  req.user = {
    // @ts-ignore
    _id: '65eccf991ff50fe702cf9b44',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errors());

app.use(
  (
    err: ErrorWithStatusCode,
    _req: SessionRequest,
    res: Response,
    // eslint-disable-next-line no-unused-vars
    _next: NextFunction,
  ) => {
    const { statusCode = STATUS_ERROR_SERVER, message } = err;

    res.status(statusCode).send({
      message: statusCode === STATUS_ERROR_SERVER ? 'На сервере произошла ошибка' : message,
    });
  },
);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(`${BASE_PATH}:${PORT}`);
});
