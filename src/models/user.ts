import mongoose from 'mongoose';
import validator from 'validator';

interface IUser {
  name: string,
  about: string,
  avatar: string,
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" - обязательно для заполнения.'],
    minlength: [2, 'Минимальная длина поля "name" - 2 символа.'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов.'],
  },
  about: {
    type: String,
    required: [true, 'Поле "about" - обязательно для заполнения.'],
    minlength: [2, 'Минимальная длина поля "name" - 2 символа.'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов.'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле "avatar" - обязательно для заполнения.'],
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Неккоректный URL',
    },
  },
}, { versionKey: false });

export default mongoose.model<IUser>('user', userSchema);
