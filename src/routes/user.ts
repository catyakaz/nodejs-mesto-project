import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

export default router;