import express, {
  Response, NextFunction, Request, Express,
} from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import cardRouter from './routes/card';
import userRouter from './routes/user';
import auth from './middlewares/auth';
import error from './middlewares/error';
import { createUserValidation, signinValidation } from './utils/validation';
import { createUser, login } from './controllers/user';
import { errorLogger, requestLogger } from './middlewares/logger';
import NotFound from './utils/errors/NotFound';

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app: Express = express();
const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', signinValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((_req: Request, _res: Response, next: NextFunction): void => {
  next(new NotFound('Ресурс недоступен.'));
});

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, (): void => {
  console.log(`Сервер доступен по адресу ${PORT}`);
});
