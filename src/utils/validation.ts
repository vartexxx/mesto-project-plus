import { Joi, celebrate, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import BadRequest from './errors/BadRequest';

const EMAIL_VALIDATION: Joi.StringSchema = Joi.string().required().email().messages({
  'any.required': 'Email обязателен',
  'string.empty': 'Email не может быть пустым',
});
const PASSWORD_VALIDATION: Joi.StringSchema = Joi.string().required().messages({
  'any.required': 'Пароль обязателен',
  'string.empty': 'Пароль не может быть пустым',
});

const NAME_VALIDATION: Joi.StringSchema = Joi.string().min(2).max(30).messages({
  'string.min': 'Имя не может быть короче 2 символов',
  'string.max': 'Имя не может быть длиннее 30 символов',
});
const ABOUT_VALIDATION: Joi.StringSchema = Joi.string().min(2).max(30).messages({
  'string.min': 'About не может быть короче 2 символов',
  'string.max': 'About не может быть длиннее 30 символов',
});
const AVATAR_VALIDATION: Joi.StringSchema = Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/).messages({
  'string.pattern.base': 'Некорректная ссылка',
});

export const signinValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: EMAIL_VALIDATION,
    password: PASSWORD_VALIDATION,
  }),
});

export const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: EMAIL_VALIDATION,
    password: PASSWORD_VALIDATION,
    name: NAME_VALIDATION,
    about: ABOUT_VALIDATION,
    avatar: AVATAR_VALIDATION,
  }),
});

const ID_VALIDATION: Joi.StringSchema = Joi.string().required().custom((value) => {
  if (isValidObjectId(value)) {
    return value;
  }
  return new BadRequest('Запрашиваемый id неправильный или не существует.');
}, 'Id validation');

export const getUserValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: ID_VALIDATION,
  }),
});

export const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: NAME_VALIDATION,
    about: ABOUT_VALIDATION,
  }),
});

export const updateUserAvatarValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: AVATAR_VALIDATION.required(),
  }),
});

const LINK_VALIDATION: Joi.StringSchema = Joi.string().required().messages({
  'any.required': 'Ссылка обязательна',
});

export const createCardValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: NAME_VALIDATION,
    link: LINK_VALIDATION,
  }),
});

export const cardValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: ID_VALIDATION,
  }),
});
