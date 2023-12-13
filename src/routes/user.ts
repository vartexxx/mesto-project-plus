import { Router } from 'express';
import {
  createUser, getUser, getUsers, updateUser, updateUserAvatar,
} from '../controllers/user';

const userRouter: Router = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
