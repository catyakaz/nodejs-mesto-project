import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { SessionRequest } from '../types';
import NotFoundError from '../errors/not-found';
import ConflictError from '../errors/conflict';
import {
  CAST_ERROR_NAME,
  VALIDATION_ERROR_NAME,
  STATUS_CREATED,
  DEFAULT_JWT_SECRET,
} from '../utils/constants';
import BadRequestError from '../errors/bad-request';

const { JWT_SECRET = DEFAULT_JWT_SECRET } = process.env;

export const getUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.params.userId)
  .orFail(new NotFoundError('Нет пользователя с таким _id'))
  .then((user) => {
    res.send(user);
  })
  .catch((err) => {
    if (err.name === CAST_ERROR_NAME) {
      throw new BadRequestError('Передан некорректный _id пользователя');
    } else {
      next(err);
    }
  });

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    name,
    about,
    avatar,
    password,
    email,
  } = req.body;

  User.findOne({ email })
    .then((owner) => {
      if (owner) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
      return bcrypt.hash(password, 10)
        .then((hash: string) => User.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        }))
        .then((user) => {
          res.status(STATUS_CREATED).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        });
    }).catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      } else {
        next(err);
      }
    });
};

export const updateUser = async (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user?._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Нет пользователя с таким _id'))
    .then((user) => {
      res.send(user);
    }).catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        throw new BadRequestError('Переданы некорректные данные при обновлении пользователя');
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = async (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user?._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Нет пользователя с таким _id'))
    .then((user) => {
      res.send(user);
    }).catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара пользователя');
      } else {
        next(err);
      }
    });
};

export const login = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET!);

      return res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        }).json({ message: 'Вы успешно авторизовались' });
    })
    .catch(next);
};

export const getMyInfo = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => User.findById(req.user?._id)
  .orFail(new NotFoundError('Нет пользователя с таким _id'))
  .then((user) => {
    res.send(user);
  })
  .catch((err) => {
    if (err.name === CAST_ERROR_NAME) {
      throw new BadRequestError('Передан некорректный _id пользователя');
    } else {
      next(err);
    }
  });
