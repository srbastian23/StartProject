// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';

import type {User} from '../entities';
import type {RootState} from '../modules';

type Props = {|
  exact?: boolean,
  path: string,
  component: any,
  componentProps?: any,
  user?: User,
  initialAuthDone?: boolean,
|};

export const SKIP_INITIAL_CONFIG_STORAGE_KEY = 'skip_initial_config';

const _PrivateRoute = ({
  component: Component,
  componentProps,
  user,
  initialAuthDone,
  ...rest
}: Props) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!initialAuthDone) return null;
        const content = <Component {...componentProps} />;
        if (!!user) {
          return content;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                search: window.location.search,
              }}
            />
          );
        }
      }}
    />
  );
};

export const PrivateRoute = connect((state: RootState) => ({
  user: state.auth.user,
  initialAuthDone: state.auth.initialAuthDone,
}))(_PrivateRoute);

_PrivateRoute.propTypes = {
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
  component: PropTypes.any.isRequired,
  componentProps: PropTypes.object,
  user: PropTypes.object,
  initialAuthDone: PropTypes.bool,
};
