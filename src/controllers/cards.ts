import { NextFunction, Request, Response } from 'express';
import Card from '../models/cards';
import { SessionRequest } from '../types';
import {
  CAST_ERROR_NAME,
  VALIDATION_ERROR_NAME,
  STATUS_CREATED,
} from '../utils/constants';
import NotFoundError from '../errors/not-found';
import ForbiddenError from '../errors/forbidden';
import BadRequestError from '../errors/bad-request';

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
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

export const deleteCard = (
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) => Card.findById({ _id: req.params.cardId })
  .orFail(new NotFoundError('Нет карточки с таким _id'))
  .then((card) => {
    if (card.owner.toString() === req.user?._id.toString()) {
      card.remove().then(() => res.send({ message: 'Карточка удалена' }));
    }
    throw new ForbiddenError('Вы не владелец этой карточки');
  }).catch((err) => {
    if (err.name === CAST_ERROR_NAME) {
      next(new BadRequestError('Передан некорректный _id карточки'));
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
      next(new BadRequestError('Передан некорректный _id карточки для постановки лайка'));
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
      next(new BadRequestError('Передан некорректный _id карточки для удаления лайка'));
    } else {
      next(err);
    }
  });
