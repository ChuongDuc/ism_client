import { makeVar } from '@apollo/client';
import jwt from 'jsonwebtoken';
import { SESSION_KEY } from '../../constant';

const getUser = () => {
  const accessToken = window.localStorage.getItem(SESSION_KEY.ACCESS_TOKEN);
  if (accessToken) {
    return jwt.decode(accessToken, {});
  }
  return null;
};

export const currentUser = makeVar(getUser());
