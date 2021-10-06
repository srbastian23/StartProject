// @flow
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Auth from '../components/Auth';
import {actions as AuthAction} from '../duck';
import type {RootState} from '../../index';
import type {Dispatch} from 'redux';

export default connect(
  (state: RootState) => ({
    isAuthenticating: state.auth.isAuthenticating,
    user: state.auth.user,
    loginError: state.auth.loginError,
  }),
  (dispatch: Dispatch<any>) =>
    bindActionCreators(
      {
        ...AuthAction,
      },
      dispatch
    )
)(Auth);
