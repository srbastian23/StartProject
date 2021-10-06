// @flow
export type ApiError = {|
  status: number,
  error: {message?: string, name: string},
|};
