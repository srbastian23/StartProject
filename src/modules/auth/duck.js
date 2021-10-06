// @flow
import {ofType} from 'redux-observable';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {SKIP_INITIAL_CONFIG_STORAGE_KEY} from '../../router/PrivateRoute';
import {ActionCreator, buildCatchError, createReducer} from '../../store/utils';
import {
  getSessionApi,
  refreshSessionApi,
  loginApi,
  logoutApi,
  resetPasswordApi,
  // registerApi,
} from './api';

import type {User} from '../../entities';
import type {Action} from '../../store/utils';
import type {ActionsObservable, StateObservable} from 'redux-observable';
import type {RootState} from '../index';

export type AuthAction = Action & {
  email?: string,
  error?: string,
  password?: string,
  user?: User,
};

export type AuthState = {
  user?: User,
  isAuthenticating?: boolean,
  loginError?: string,
  registerError?: string,
  initialAuthDone?: boolean,
  resetPasswordError?: string,
  isResettingPassword?: boolean,
  resetPasswordSuccess?: boolean,
};

export class GetSession extends ActionCreator<AuthAction> {}
export class GetSessionSuccess extends ActionCreator<AuthAction> {}
export class GetSessionErrorFn extends ActionCreator<AuthAction> {}
// export class GetSession extends ActionCreator<AuthAction> {}
export class RefreshSessionSuccess extends ActionCreator<AuthAction> {}
export class RefreshSessionErrorFn extends ActionCreator<AuthAction> {}
export class Login extends ActionCreator<AuthAction> {}
export class LoginSuccess extends ActionCreator<AuthAction> {}
export class LoginErrorFn extends ActionCreator<AuthAction> {}
export class Register extends ActionCreator<AuthAction> {}
export class RegisterSuccess extends ActionCreator<AuthAction> {}
export class RegisterErrorFn extends ActionCreator<AuthAction> {}
export class Logout extends ActionCreator<AuthAction> {}
export class AuthResetState extends ActionCreator<AuthAction> {}
export class AuthNoop extends ActionCreator<AuthAction> {}
export class ResetPassword extends ActionCreator<AuthAction> {}
export class ResetPasswordSuccess extends ActionCreator<AuthAction> {}
export class ResetPasswordErrorFn extends ActionCreator<AuthAction> {}

export const actions = {
  getSession: (payload: AuthAction) => new GetSession(payload),
  login: (payload: AuthAction) => new Login(payload),
  logout: (payload: AuthAction) => new Logout(payload),
  authResetState: (payload: AuthAction) => new AuthResetState(payload),
  resetPassword: (payload: AuthAction) => new ResetPassword(payload),
};

export const initialState = {};

export default createReducer(initialState, {
  [GetSession.type]: () => ({isAuthenticating: true}),
  [GetSessionSuccess.type]: (_, action: AuthAction) => ({
    user: action.user,
    initialAuthDone: true,
  }),
  [GetSessionErrorFn.type]: () => ({initialAuthDone: true}),
  // [RefreshSession.type]: () => ({isAuthenticating: true}),
  [RefreshSessionSuccess.type]: (state: AuthState) => ({
    ...state,
  }),
  [RefreshSessionErrorFn.type]: (state: AuthState) => ({...state}),
  [Login.type]: (state: AuthState) => ({
    ...state,
    isAuthenticating: true,
    loginError: undefined,
  }),
  [LoginSuccess.type]: (state: AuthState, action: AuthAction) => ({
    ...state,
    user: action.user,
    isAuthenticating: false,
    loginError: undefined,
  }),
  [LoginErrorFn.type]: (state: AuthState, action: AuthAction) => ({
    ...state,
    loginError: action.error,
    isAuthenticating: false,
    registerError: undefined,
  }),
  [Register.type]: (state: AuthState) => ({...state, isAuthenticating: true}),
  [RegisterSuccess.type]: (state: AuthState, action: AuthAction) => ({
    ...state,
    user: action.user,
    isAuthenticating: false,
    registerError: undefined,
  }),
  [RegisterErrorFn.type]: (state: AuthState, action: AuthAction) => ({
    ...state,
    registerError: action.error,
    isAuthenticating: false,
  }),
  [Logout.type]: () => ({...initialState, initialAuthDone: true}),
  [AuthResetState.type]: () => initialState,
  [AuthNoop.type]: (state: AuthState) => state,
  [ResetPassword.type]: (state: AuthState) => ({
    ...state,
    isResettingPassword: true,
  }),
  [ResetPasswordSuccess.type]: (state: AuthState) => ({
    ...state,
    isResettingPassword: false,
    resetPasswordSuccess: true,
  }),
  [ResetPasswordErrorFn.type]: (state: AuthState, action: AuthAction) => ({
    ...state,
    resetPasswordError: action.error,
    isResettingPassword: false,
  }),
});

export const getSessionEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(GetSession.type),
    switchMap(() =>
      getSessionApi().pipe(
        map((user: User) => new GetSessionSuccess({user})),
        buildCatchError(GetSessionErrorFn)
      )
    )
  );

export const loginEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(Login.type),
    switchMap((action: AuthAction) =>
      loginApi({
        email: action.email,
        password: action.password,
      }).pipe(
        map((user: User) => {
          localStorage.removeItem(SKIP_INITIAL_CONFIG_STORAGE_KEY);
          return new LoginSuccess({user});
        }),
        buildCatchError(LoginErrorFn)
      )
    )
  );

export const logoutEpic = (action$: ActionsObservable) =>
  action$.pipe(
    ofType(Logout.type),
    switchMap(() =>
      logoutApi().pipe(
        map(() => new AuthNoop()),
        catchError(() => of(new AuthNoop()))
      )
    )
  );
