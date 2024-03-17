import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getMyInfo,
} from '../controllers/user';
import {
  getUserByIdCelebrateError,
  updateUserAvatarCelebrateError,
  updateUserCelebrateError,
} from '../middlewares/celebrateErrors';

const router = Router();

router.get('/', getUsers);

router.get('/me', getMyInfo);

router.get('/:userId', getUserByIdCelebrateError, getUserById);

router.patch('/me', updateUserCelebrateError, updateUser);

router.patch('/me/avatar', updateUserAvatarCelebrateError, updateUserAvatar);

export default router;
