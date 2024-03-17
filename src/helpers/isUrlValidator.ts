import { isURL } from 'validator';

export const isUrlValidate = (value: string) => {
  const result = isURL(value);

  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

export const isUrlAvatarValid = (value: string) => {
  const regexp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

  return regexp.test(value) ? value : '';
};
