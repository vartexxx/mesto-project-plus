import { Router } from 'express';
import {
  getCurrentUser,
  getUser,
  getUsers,
  updateUser,
  updateUserAvatar,
} from '../controllers/user';
import {
  getUserValidation,
  updateUserAvatarValidation,
  updateUserValidation,
} from '../utils/validation';

const userRouter: Router = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', getUserValidation, getUser);
userRouter.patch('/me', updateUserValidation, updateUser);
userRouter.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);

export default userRouter;
