import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import user from '../models/user';
import {
  ERROR_BAD_REQUEST,
  ERROR_SERVER,
  STATUS_OK,
} from '../utils/statusCode';
import AlreadyExists from '../utils/errors/AlreadyExists';
import BadRequest from '../utils/errors/BadRequest';

export const getUsers = (_req: Request, res: Response): void => {
  user.find({}).then((users) => res.status(STATUS_OK).send(users))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' }));
};

export const createUser = (req: Request, res: Response, next: NextFunction): void => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  }: any = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name, about, avatar, email, password: hash,
    }))
    .then((userInformation) => {
      res.send({
        _id: userInformation._id,
        name: userInformation.name,
        about: userInformation.about,
        avatar: userInformation.avatar,
        email: userInformation.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyExists('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
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
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Пользователь с указанным _id не найден.' });
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

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  user.findById(req.user._id)
    .then((userInfo) => {
      if (!userInfo) {
        throw new BadRequest('Пользователь по указанному _id не найден');
      } else {
        res.send(userInfo);
      }
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((body): void => {
      res.send({
        token: jwt.sign({ _id: body._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};
