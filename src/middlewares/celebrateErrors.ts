import { celebrate, Joi } from 'celebrate';
import { isUrlAvatarValid, isUrlValidate } from '../helpers';

export const authCelebrateError = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

export const getUserByIdCelebrateError = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

export const updateUserCelebrateError = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

export const updateUserAvatarCelebrateError = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(isUrlAvatarValid),
  }),
});

export const createCardCelebrateError = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(isUrlValidate),
  }),
});

export const deleteCardCelebrateError = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

export const likeCardCelebrateError = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

export const dislikeCardCelebrateError = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});
