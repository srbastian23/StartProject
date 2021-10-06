// @flow
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import {createMuiTheme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/core/styles';
import {actions as AuthActions} from './modules/auth/duck';
import AuthContainer from './modules/auth/containers/AuthContainer';
import CssBaseline from '@material-ui/core/CssBaseline';
import {PrivateRoute} from './router/PrivateRoute';
import red from '@material-ui/core/colors/red';
import {colors} from './assets/styles/colors';

import type {Dispatch} from 'redux';
import type {RootState} from './modules';
import type {User} from './entities';

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#FFFFFF',
    },
    primary: {
      main: colors.purple3,
    },
    secondary: {
      main: '#E9943F',
    },
    error: red,
    success: {
      main: colors.success,
    },
  },
  typography: {
    fontFamily: '"Poppins", "Muli", sans-serif',
  },
  borderRadius: 5,
  spacing: x => `${x * 8}px`,
});

type Props = {|
  authResetState: () => void,
  getSession: () => void,
  user: User,
|};

function App(props: Props) {
  const {getSession, user} = props;

  useEffect(() => {
    getSession();
    if (document && document.location.hostname) {
      //get user data or another thing
      console.log('document.location.hostname', document.location.hostname);
    }
  }, [getSession]);

  return (
    <ThemeProvider theme={theme}>
      <div>
        <CssBaseline />
        <Switch>
          <Route exact path="/">
            <div>Hola</div>
          </Route>
          <Route path="/login">
            <div>
              <AuthContainer />
            </div>
          </Route>
          <PrivateRoute path="/profile" component={() => <div>Profile</div>} />
        </Switch>
      </div>
    </ThemeProvider>
  );
}

App.propTypes = {
  authResetState: PropTypes.func.isRequired,
  getSession: PropTypes.func.isRequired,
  user: PropTypes.any,
};

export default connect(
  (state: RootState) => ({
    user: state.auth.user,
  }),
  (dispatch: Dispatch<any>) =>
    bindActionCreators(
      {
        ...AuthActions,
      },
      dispatch
    )
)(App);
