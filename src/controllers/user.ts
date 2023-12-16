import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import user from '../models/user';
import { STATUS_OK } from '../utils/statusCode';
import AlreadyExists from '../utils/errors/AlreadyExists';
import BadRequest from '../utils/errors/BadRequest';
import NotFound from '../utils/errors/NotFound';

export const getUsers = (_req: Request, res: Response, next: NextFunction): void => {
  user.find({}).then((users) => res.status(STATUS_OK).send(users))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction): void => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash: string) => user.create({
      name, about, avatar, email, password: hash,
    }))
    .then((userInformation): void => {
      res.status(STATUS_OK).send({
        _id: userInformation._id,
        name: userInformation.name,
        about: userInformation.about,
        avatar: userInformation.avatar,
        email: userInformation.email,
      });
    })
    .catch((err): void => {
      if (err.code === 11000) {
        next(new AlreadyExists('Пользователь с таким email уже существует.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((userInfo): void => {
      if (!userInfo) {
        throw new NotFound('Пользователь не найден.');
      }
      res.status(STATUS_OK).send(userInfo);
    })
    .catch((err): void => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара.'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Запрашиваемый id некорректен.'));
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction): void => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((userInfo): void => {
      if (!userInfo) {
        throw new NotFound('Пользователь по указанному _id не найден.');
      }
      res.status(STATUS_OK).send(userInfo);
    })
    .catch((err): void => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара.'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Запрашиваемый id некорректен.'));
      } else {
        next(err);
      }
    });
};

export const getUser = (req: Request, res: Response, next: NextFunction): void => {
  user.findById(req.params.userId)
    .then((userInfo): void => {
      if (!userInfo) {
        throw new NotFound('Пользователь не найден.');
      }
      res.status(STATUS_OK).send(userInfo);
    })
    .catch((err): void => {
      if (err.name === 'CastError') {
        next(new BadRequest('Запрашиваемый id некорректен.'));
      } else {
        next(err);
      }
    });
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction): void => {
  user.findById(req.user._id)
    .then((userInfo): void => {
      if (!userInfo) {
        throw new NotFound('Пользователь по указанному _id не найден.');
      }
      res.status(STATUS_OK).send(userInfo);
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password, next)
    .then((body): void => {
      res.status(STATUS_OK).send({
        token: jwt.sign({ _id: body._id }, 'super-strong-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};
