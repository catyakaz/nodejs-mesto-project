import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errors, Joi, celebrate } from 'celebrate';

import usersRouter from './routes/user';
import cardsRouter from './routes/cards';
import errorsRouter from './routes/errors';

import { login, createUser } from './controllers/user';

import {
  DEFAULT_PORT,
  DEFAULT_BASE_PATH,
} from './utils/constants';

import errorsMiddlewares from './middlewares/errors';
import authMiddlewares from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { authCelebrateError } from './middlewares/celebrateErrors';

const { PORT = DEFAULT_PORT, BASE_PATH = DEFAULT_BASE_PATH } = process.env;

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('Connected to MongoDB.'))
  .catch(console.log);

app.use(requestLogger);

app.post('/signin', authCelebrateError, login);
app.post('/signup', authCelebrateError, createUser);

app.use(authMiddlewares);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', errorsRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorsMiddlewares);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(`${BASE_PATH}:${PORT}`);
});
