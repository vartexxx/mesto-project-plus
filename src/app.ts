import express, { Response, NextFunction, Request } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import cardRouter from './routes/card';
import userRouter from './routes/user';
import auth from './middlewares/auth';
import BadRequest from './utils/errors/BadRequest';
import error from './middlewares/error';
import { createUserValidation, signinValidation } from './utils/validation';
import { createUser, login } from './controllers/user';
import { errorLogger, requestLogger } from './middlewares/logger';

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', signinValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((_req: Request, _res: Response, next: NextFunction): void => {
  next(new BadRequest('Ресурс недоступен.'));
});

app.use(errorLogger);
app.use(errors);
app.use(error);

app.listen(PORT, (): void => {
  console.log(`Сервер доступен по адресу ${PORT}`);
});
