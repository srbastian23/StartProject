// @flow
import {of} from 'rxjs';
import {catchError} from 'rxjs/operators';

import type {ApiError} from '../http/error';

export type Action = {
  [key: string]: any,
};

export type Reducer = (state: any, action: Action) => any;

export type ReducerMap = {
  [key: string]: Reducer,
};

export class ActionCreator<T> {
  static name: string;

  static get fnName(): string {
    const name = this.name;
    return name[0].toLowerCase() + name.slice(1);
  }

  static get type(): string {
    return `${this.name}`;
  }

  constructor(payload: T = ({}: any)) {
    return {
      type: this.constructor.type,
      ...payload,
    };
  }
}

export function generateActionCreators<T>(
  classes: Class<ActionCreator<T>>[]
): {[key: string]: () => void} {
  const r = {};
  classes.forEach(
    (cls: Class<ActionCreator<T>>) => (r[(cls: any).fnName] = aa => new cls(aa))
  );
  return r;
}

export const createReducer = <S>(
  initialState: any,
  reducerMap: ReducerMap,
  debug: boolean = false
): Reducer => (state: S, action: Action) => {
  if (debug) {
    console.log('[ACTION]:', action);
  }
  if (action.type && reducerMap.hasOwnProperty(action.type)) {
    return reducerMap[action.type](state, action);
  }
  return state || initialState;
};

export const buildCatchError = (
  actionCls: Class<ActionCreator<any>>,
  authoritativeMessage?: string,
  fallbackMessage: string = 'Unexpected server error'
) =>
  catchError((error: ApiError) => {
    const m =
      error && error.error && error.error.message
        ? error.error.message
        : fallbackMessage;
    return of(
      new actionCls({
        error: authoritativeMessage || m,
      })
    );
  });
