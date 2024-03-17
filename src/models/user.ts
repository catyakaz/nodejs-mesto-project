import {
  model,
  Schema,
  Model,
  Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import {
  DEFAULT_ABOUT,
  DEFAULT_AVATAR,
  DEFAULT_NAME,
} from '../utils/constants';
import UnauthorizedError from '../errors/unauthorized';
import { isUrlAvatarValid } from '../helpers';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface IUserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: DEFAULT_NAME,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: DEFAULT_ABOUT,
  },
  avatar: {
    type: String,
    default: DEFAULT_AVATAR,
    validate: {
      validator: (v: string) => isUrlAvatarValid(v),
      message: 'Неправильный формат ссылки',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics
  .findUserByCredentials = function findByCredentials(email: string, password: string) {
    return this.findOne({ email }).select('+password')
      .then((user: IUser) => {
        if (!user) {
          return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
        }

        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
            }
            return user;
          });
      });
  };

export default model<IUser, IUserModel>('user', userSchema);
