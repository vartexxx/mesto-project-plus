import mongoose from 'mongoose';
import validator from 'validator';

interface ICard {
  name: string,
  link: string,
  owner: mongoose.Types.ObjectId,
  likes: ReadonlyArray<mongoose.Types.ObjectId>,
  createdAt: Date,
}

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" - обязательно для заполнения.'],
    minLength: [2, 'Минимальная длина поля "name" - 2 символа.'],
    maxLength: [30, 'Максимальная длина поля "name" - 30 символов.'],
  },
  link: {
    type: String,
    required: [true, 'Поле "link" - обязательно для заполнения.'],
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Неккоректный URL',
    },
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Поле "owner" - обязательно для заполнения.'],
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });

export default mongoose.model<ICard>('card', cardSchema);
