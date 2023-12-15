import { Request, Response } from 'express';
import card from '../models/card';
import {
  ERROR_BAD_REQUEST,
  ERROR_SERVER,
  STATUS_CREATED,
  STATUS_OK,
} from '../utils/statusCode';

export const getCards = (_req: Request, res: Response): void => {
  card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' }));
};

export const createCard = (req: any, res: Response): void => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then((cardInformation) => res.status(STATUS_CREATED).send(cardInformation))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' });
    });
};

export const deleteCard = (req: Request, res: Response): void => {
  card.findByIdAndRemove(req.params.cardId)
    .then((cardInformation) => res.status(STATUS_OK).send(cardInformation))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' });
    });
};

export const addLikeCard = (req: any, res: Response): void => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((cardInformation) => res.status(STATUS_OK).send(cardInformation))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки.' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' });
    });
};

export const deleteLikeCard = (req: any, res: Response): void => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardInformation) => res.status(STATUS_OK).send(cardInformation))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: ' Переданы некорректные данные для снятия лайка.' });
      }
      if (err.name === 'CastError') {
        return res.status(ERROR_BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(ERROR_SERVER).send({ message: 'Ошибка со стороны сервера.' });
    });
};
