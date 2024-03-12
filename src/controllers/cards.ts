import { NextFunction, Request, Response } from 'express';
import Card from '../models/cards';
import { SessionRequest } from '../types';
import {
  CAST_ERROR_NAME,
  VALIDATION_ERROR_NAME,
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
} from '../utils/constants';
import NotFoundError from '../errors/not-found';

export const getCards = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

export const createCard = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => {
      res.status(STATUS_CREATED).send(card);
    }).catch((err) => {
      if (err.name === VALIDATION_ERROR_NAME) {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        next(err);
      }
    });
};

export const deleteCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndRemove({ _id: req.params.cardId })
  .orFail(new NotFoundError('Нет карточки с таким _id'))
  .then((card) => {
    res.send(card);
  }).catch((err) => {
    if (err.name === CAST_ERROR_NAME) {
      res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Передан некорректный _id карточки' });
    } else {
      next(err);
    }
  });

export const likeCard = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user?._id } },
  { new: true },
).orFail(new NotFoundError('Нет карточки с таким _id'))
  .then((card) => {
    res.send(card);
  }).catch((err) => {
    if (err.name === CAST_ERROR_NAME) {
      res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Передан некорректный _id карточки для постановки лайка' });
    } else {
      next(err);
    }
  });

export const dislikeCard = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id } },
  { new: true },
).orFail(new NotFoundError('Нет карточки с таким _id'))
  .then((card) => {
    res.send(card);
  })
  .catch((err) => {
    if (err.name === CAST_ERROR_NAME) {
      res
        .status(STATUS_BAD_REQUEST)
        .send({ message: 'Передан некорректный _id карточки для удаления лайка' });
    } else {
      next(err);
    }
  });
