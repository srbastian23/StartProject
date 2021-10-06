// @flow
import {ajax} from 'rxjs/ajax';
import queryString from 'query-string';
import {map, catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

import type {Observable} from 'rxjs';
import type {AjaxError} from 'rxjs/ajax';
import type {ApiError} from './error';

export type RequestOptions = {|
  route?: string,
  queryParams?: {[key: string]: string},
  body?: {[key: string]: string | number},
  headers?: {[key: string]: string},
  debug?: boolean,
|};

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function httpCreatorFactory(
  method: RequestMethod,
  route: string,
  o?: RequestOptions
): Observable<any> {
  let url = route;
  let queryParams = {};
  let headers = {};
  let body;
  let debug = false;

  if (o) {
    debug = o.debug || false;
    body = o.body;

    if (body && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (o.route) {
      url = o.route;
    }
    if (o.queryParams) {
      queryParams = o.queryParams;
    }
    if (o.headers) {
      headers = o.headers;
    }
  }

  if (Object.keys(queryParams).length > 0) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  const ajaxOptions: Object = {
    url,
    method,
    headers,
    body,
  };

  switch (method) {
    case 'GET':
    case 'POST':
    case 'PUT':
    case 'DELETE':
      break;
    default:
      throw new Error('HTTP Method not supported');
  }

  if (debug) {
    console.log(`[${method}] ${url}`);
  }

  return ajax(ajaxOptions).pipe(
    map(ajaxResponse => {
      const response = ajaxResponse.response;
      if (debug) {
        console.log(`[${method}] ${url} =>`, response);
      }
      return response;
    }),
    catchError((ajaxError: AjaxError) => {
      const response: ApiError = {
        status: ajaxError.status,
        error: ajaxError.response,
      };
      if (debug) {
        console.error(`[${method}] ${url} =>`, response);
      }
      return throwError(response);
    })
  );
}

export const buildRoute = (route: string, params: string[]): string => {
  const re = /(:[a-zA-Z1-9]+)\/?/gi;
  const groups = [...route.matchAll(re)].map(x => x[1]);
  if (params.length !== groups.length)
    throw new Error(
      'The number of parameters does not match with the found groups.\n' +
        `\tGiven params (${params.length}): ${params.join(',')}\n` +
        `\tFound groups (${groups.length}): ${groups.join(',')}\n`
    );
  let r = route;
  groups.forEach((g: string, idx: number) => (r = r.replace(g, params[idx])));
  return r;
};

export const getCreator = (route: string) => (
  queryParams?: {[key: string]: string},
  o?: RequestOptions
) => httpCreatorFactory('GET', route, {queryParams, ...o});

export const postCreator = (route: string) => (
  body?: {[key: string]: any},
  o?: RequestOptions
) => httpCreatorFactory('POST', route, {body, ...o});

export const putCreator = (route: string) => (
  body?: {[key: string]: any},
  o?: RequestOptions
) => httpCreatorFactory('PUT', route, {body, ...o});

export const deleteCreator = (route: string) => (o?: RequestOptions) =>
  httpCreatorFactory('DELETE', route, o);
