import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import usersRouter from './routes/user';
import cardsRouter from './routes/cards';
import errorsRouter from './routes/errors';

import { SessionRequest } from './types';
import {
  DEFAULT_PORT,
  DEFAULT_BASE_PATH,
} from './utils/constants';
import errorsMiddlewares from './middlewares/errors';

const { PORT = DEFAULT_PORT, BASE_PATH = DEFAULT_BASE_PATH } = process.env;

const app = express();

app.use(helmet());
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
app.use('*', errorsRouter);

app.use(errors());

app.use(errorsMiddlewares);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(`${BASE_PATH}:${PORT}`);
});
