import express from 'express';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, (): void => {
  console.log(`Сервер доступен по адресу ${PORT}`);
});
