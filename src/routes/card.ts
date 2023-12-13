import { Router } from 'express';
import {
  addLikeCard,
  createCard,
  deleteCard,
  deleteLikeCard,
  getCards,
} from '../controllers/card';

const cardRouter: Router = Router();

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.put('/:cardId/likes', addLikeCard);
cardRouter.delete('/:cardId/likes', deleteLikeCard);

export default cardRouter;
