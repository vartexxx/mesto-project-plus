import { Request, Response } from 'express';
import user from '../models/user';
import {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  STATUS_CREATED,
  STATUS_OK,
} from '../utils/statusCode';

export const getUsers = (req: Request, res: Response): void => {
  user.find({}).then((users) => res.status(STATUS_OK).send(users))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' }));
};

export const createUser = (req: Request, res: Response): void => {
  const { name, about, avatar }: any = req.body;
  console.log(req.body);
  user.create({ name, about, avatar })
    .then((newUser) => res.status(STATUS_CREATED).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' });
    });
};

export const updateUser = (req: any, res: Response): void => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((userInformation): void => {
      res.status(STATUS_OK).send(userInformation);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' });
    });
};

export const updateUserAvatar = (req: any, res: Response): void => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updateAvatar) => res.status(STATUS_OK).send(updateAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' });
    });
};

export const getUser = (req: Request, res: Response): void => {
  user.findById(req.params.userId)
    .then((userInformation) => res.status(STATUS_OK).send(userInformation))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' });
    });
};
