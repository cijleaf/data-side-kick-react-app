import isEmail from 'validator/lib/isEmail';
import is, { createValidation } from './is-core';

export function required(value) {
  if (!value) {
    return 'This field is required';
  }

  return undefined;
}

export function minLength(min) {
  return ({ length }) => {
    if (length < min) {
      return `Must be ${min} characters or more`;
    }

    return undefined;
  };
}

export function maxLength(max) {
  return ({ length }) => {
    if (length > max) {
      return `Must be not more ${max} characters`;
    }

    return undefined;
  };
}

export function validEmail(value) {
  if (!isEmail(value)) {
    return 'This email is invalid';
  }

  return undefined;
}

export function similarPasswords(value, similarValue) {
  if (value !== similarValue) {
    return 'Is not the same as password';
  }

  return undefined;
}

export const firstName = is(required, minLength(2), maxLength(265));
export const lastName = is(required, minLength(2), maxLength(265));
export const email = is(required, validEmail, maxLength(265));
export const password = is(required, minLength(8), maxLength(265));
export const confirmPassword = is(required, minLength(8), maxLength(265), similarPasswords);

export const createAccountValidation = createValidation(values => ({
  first_name: firstName(values.first_name),
  last_name: lastName(values.last_name),
  email: email(values.email),
  password: password(values.password),
  confirmPassword: confirmPassword(values.confirmPassword, values.password),
}));

export const loginValidation = createValidation(values => ({
  email: email(values.email),
  password: password(values.password),
}));
