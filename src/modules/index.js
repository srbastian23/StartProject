// @flow
import {combineReducers} from 'redux';
import {combineEpics} from 'redux-observable';

import type {Action} from '../store/utils';
import type {AuthState} from './auth/duck';

import authReducer, {
  initialState as AuthInitialState,
  Logout,
  getSessionEpic,
  loginEpic,
  logoutEpic,
} from './auth/duck';

export type RootState = {
  auth: AuthState,
};

export const defaultInitialState = {
  auth: AuthInitialState,
};

export const appReducer = combineReducers({
  auth: authReducer,
});

export const rootEpic = combineEpics(
  // auth
  getSessionEpic,
  loginEpic,
  logoutEpic
);

export const rootReducer = (state: RootState, action: Action) => {
  // Clear higher order state when logout
  /*if (action.type === Logout.type) {
    // But keep localValue (these are agnostic)
    state = {...defaultInitialState};
  }*/
  return appReducer(state, action);
};
