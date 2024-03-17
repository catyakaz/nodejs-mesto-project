import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getMyInfo,
} from '../controllers/user';
import { isUrlAvatarValid } from '../helpers';

const router = Router();

router.get('/', getUsers);

router.get('/me', getMyInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(isUrlAvatarValid),
  }),
}), updateUserAvatar);

export default router;
