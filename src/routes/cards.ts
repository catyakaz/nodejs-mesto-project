import { Router } from 'express';
import {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import {
  createCardCelebrateError,
  deleteCardCelebrateError,
  dislikeCardCelebrateError,
  likeCardCelebrateError,
} from '../middlewares/celebrateErrors';

const router = Router();

router.get('/', getCards);

router.post('/', createCardCelebrateError, createCard);

router.delete('/:cardId', deleteCardCelebrateError, deleteCard);

router.put('/:cardId/likes', likeCardCelebrateError, likeCard);

router.delete('/:cardId/likes', dislikeCardCelebrateError, dislikeCard);

export default router;
