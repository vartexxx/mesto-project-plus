import {
  NextFunction,
  Request,
  Response,
} from 'express';
import card from '../models/card';
import {
  ERROR_BAD_REQUEST,
  ERROR_SERVER,
  STATUS_CREATED,
  STATUS_OK,
} from '../utils/statusCode';
import BadRequest from '../utils/errors/BadRequest';
import Forbidden from '../utils/errors/Forbidden';

export const getCards = (_req: Request, res: Response, next: NextFunction): void => {
  card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(next);
};

export const createCard = (req: any, res: Response, next: NextFunction): void => {
  const { name, link } = req.body;
  card.create({ name, link, owner: req.user._id })
    .then((cardInformation) => res.status(STATUS_CREATED).send(cardInformation))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      }
      next(err);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction): void => {
  card.findByIdAndRemove(req.params.cardId)
    .then((cardInfo) => {
      if (!cardInfo) {
        throw new BadRequest('Карточка по указанному _id не найдена.');
      } else if (cardInfo.owner.toString() !== req.user._id) {
        throw new Forbidden('Нельзя удалить чужую карточку.');
      } else {
        card.deleteOne({ _id: req.params.cardId })
          .then(() => {
            res.status(STATUS_OK).send({ message: 'Карточка удалена успешно.' });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан несуществующий _id'));
      } else {
        next(err);
      }
    });
};

export const addLikeCard = (req: any, res: Response, next:NextFunction): void => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((cardInfo) => {
      if (!cardInfo) {
        throw new BadRequest('Карточку по указанному _id не найдена.');
      } else {
        res.status(STATUS_OK).send(cardInfo);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан несуществующий _id карточки.'));
      } else {
        next(err);
      }
    });
};

export const deleteLikeCard = (req: any, res: Response, next: NextFunction): void => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardInfo) => {
      if (!cardInfo) {
        throw new BadRequest('Карточка по указанному _id не найдена.');
      } else {
        res.status(STATUS_OK).send(cardInfo);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан несуществующий _id карточки.'));
      } else {
        next(err);
      }
    });
};
