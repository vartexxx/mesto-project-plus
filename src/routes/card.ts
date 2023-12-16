import { Router } from 'express';
import {
  addLikeCard,
  createCard,
  deleteCard,
  deleteLikeCard,
  getCards,
} from '../controllers/card';
import {
  cardValidation,
  createCardValidation,
} from '../utils/validation';

const cardRouter: Router = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValidation, createCard);
cardRouter.delete('/:cardId', cardValidation, deleteCard);
cardRouter.put('/:cardId/likes', cardValidation, addLikeCard);
cardRouter.delete('/:cardId/likes', cardValidation, deleteLikeCard);

export default cardRouter;
