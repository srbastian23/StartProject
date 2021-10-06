import env from '../../environment';
import {getCreator, postCreator} from '../../http';

export const endpoints = Object.freeze({
  GET_SESSION: `${env.baseApiUrl}/auth/admin/vendor/session`,
  REFRESH_SESSION: `${env.baseApiUrl}/auth/admin/vendor/session/refresh`,
  LOGIN: `${env.baseApiUrl}/auth/admin/vendor/login`,
  // CREATE_USER: `${env.baseApiUrl}/auth/admin/create-user`,
  LOGOUT: `${env.baseApiUrl}/auth/admin/vendor/logout`,
  FORGOT_PASSWORD: `${env.baseApiUrl}/auth/admin/vendor/forgot-password`,
  RESET_PASSWORD: `${env.baseApiUrl}/auth/admin/vendor/reset-password`,
});

export const getSessionApi = getCreator(endpoints.GET_SESSION);
export const refreshSessionApi = postCreator(endpoints.REFRESH_SESSION);
export const loginApi = postCreator(endpoints.LOGIN);
export const logoutApi = postCreator(endpoints.LOGOUT);
