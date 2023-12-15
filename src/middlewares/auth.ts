import { JwtPayload, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Unathorized from '../utils/errors/Unathorized';

export default (req: Request, _res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unathorized('Необходима авторизация');
  }

  let payload;

  try {
    payload = verify(authorization!.replace('Bearer ', ''), 'super-strong-secret');
  } catch (err) {
    throw new Unathorized('Необходима авторизация');
  }

  // @ts-ignore
  req.user = payload as { _id: JwtPayload };
  next();
};
