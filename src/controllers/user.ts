import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { SessionRequest } from '../types';
import NotFoundError from '../errors/not-found';
import {
  CAST_ERROR_NAME,
  VALIDATION_ERROR_NAME,
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
} from '../utils/constants';

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
      res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Передан некорректный _id пользователя' });
    } else {
      next(err);
    }
  });

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CREATED).send(user);
    }).catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
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
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении пользователя',
        });
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
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара пользователя',
        });
      } else {
        next(err);
      }
    });
};
