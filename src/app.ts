import express, { Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cardRouter from './routes/card';
import userRouter from './routes/user';

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: any, res: Response, next): void => {
  req.user = {
    _id: '6574cea9ee7f4173ed957334',
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, (): void => {
  console.log(`Сервер доступен по адресу ${PORT}`);
});
