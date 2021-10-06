// @flow
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {useForm} from 'react-hook-form';
import {Redirect} from 'react-router-dom';

import type {User} from '../../../entities';

type Props = {|
  login: ({email: string, password: string}) => void,
  isAuthenticating?: boolean,
  loginError?: string,
  user?: User,
|};

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 64px)',
    position: 'relative',
  },
  formWrap: {
    backgroundColor: '#E7F1FD',
    boxSizing: 'border-box',
    padding: theme.spacing(4),
    textAlign: 'center',
    borderRadius: theme.borderRadius,
    maxWidth: 440,
  },
  form: {
    width: '100%',
  },
  inputForm: {
    marginBottom: theme.spacing(3),
  },
  innerInputForm: {
    background: 'white',
  },
  bigTitle: {
    marginBottom: theme.spacing(4),
    fontWeight: 600,
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
    fontWeight: 600,
  },
  errorText: {
    marginBottom: theme.spacing(2),
  },
  loading: {
    position: 'absolute',
  },
}));

export default function Auth(props: Props) {
  const {isAuthenticating, loginError, user} = props;

  const {
    register,
    formState: {errors},
    handleSubmit,
  } = useForm();

  const classes = useStyles();

  const onSubmit = values => {
    const {login} = props;
    console.log(values);
    login({
      email: values.email,
      password: values.password,
    });
  };

  if (user) {
    return (
      <Redirect
        to={{
          pathname: '/',
          search: window.location.search,
        }}
      />
    );
  }

  return (
    <>
      <Container maxWidth="sm">
        <div className={classes.paper}>
          <Typography component="h1" variant="h3" className={classes.bigTitle}>
            ¡Bienvenido!
          </Typography>
          <div className={classes.formWrap}>
            <form
              className={classes.form}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <TextField
                className={classes.inputForm}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
                {...register('email', {
                  required: 'This is required.',
                })}
                inputProps={{className: classes.innerInputForm}}
                disabled={isAuthenticating}
              />
              <TextField
                className={classes.inputForm}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                inputProps={{className: classes.innerInputForm}}
                disabled={isAuthenticating}
                {...register('password', {required: 'Campo obligatorio'})}
              />
              {loginError && (
                <Typography
                  component="p"
                  variant="body1"
                  className={classes.errorText}
                  color="error"
                >
                  {loginError}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                className={classes.submit}
                disabled={isAuthenticating}
              >
                Iniciar sesión
              </Button>
            </form>
          </div>
          {isAuthenticating && <CircularProgress className={classes.loading} />}
        </div>
      </Container>
    </>
  );
}

Auth.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticating: PropTypes.bool,
  loginError: PropTypes.string,
  user: PropTypes.object,
};
