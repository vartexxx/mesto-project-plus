import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import validator from 'validator';

interface IUser {
  email: string,
  password: string,
  name: string,
  about: string,
  avatar: string,
}

interface IUserModel extends mongoose.Model<IUser>{
  // eslint-disable-next-line max-len,no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле "email" - обязательно для заполнения.'],
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неккоректный email.',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" - обязательно для заполнения.'],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2 символа.'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов.'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2 символа.'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов.'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Неккоректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
}, { versionKey: false });

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user: any) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
