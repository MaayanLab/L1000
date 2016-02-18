import { routeActions } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import handleResponse from 'utils/handleResponse';

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';

export const VERIFY_TOKEN_REQUEST = 'VERIFY_TOKEN_REQUEST';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

export const UPDATE_USER = 'UPDATE_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_FAILURE = 'FORGOT_PASSWORD_FAILURE';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';

export const GET_USER_FROM_RESET_TOKEN_REQUEST = 'GET_USER_FROM_RESET_TOKEN_REQUEST';
export const GET_USER_FROM_RESET_TOKEN_FAILURE = 'GET_USER_FROM_RESET_TOKEN_FAILURE';
export const GET_USER_FROM_RESET_TOKEN_SUCCESS = 'GET_USER_FROM_RESET_TOKEN_SUCCESS';

export const CHECK_EMAIL_AVAILABLE_REQUEST = 'CHECK_EMAIL_AVAILABLE_REQUEST';
export const CHECK_EMAIL_AVAILABLE_FAILURE = 'CHECK_EMAIL_AVAILABLE_FAILURE';
export const CHECK_EMAIL_AVAILABLE_SUCCESS = 'CHECK_EMAIL_AVAILABLE_SUCCESS';

export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';

export function verifyTokenRequest() {
  return {
    type: VERIFY_TOKEN_REQUEST,
  };
}

export function loginUserSuccess(token) {
  localStorage.setItem('token', token);
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token,
      user: jwtDecode(token),
    },
  };
}

export function loginUserFailure(error) {
  localStorage.removeItem('token');
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText,
    },
  };
}

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST,
  };
}

export function updateUser({ user, token }) {
  localStorage.setItem('token', token);
  return {
    type: UPDATE_USER,
    payload: { user, token },
  };
}

export function logout() {
  localStorage.removeItem('token');
  return {
    type: LOGOUT_USER,
  };
}

export function logoutAndRedirect() {
  return (dispatch) => {
    dispatch(logout());
    dispatch(routeActions.push('/'));
  };
}

export function attemptLoginFromToken() {
  return (dispatch) => {
    dispatch(verifyTokenRequest());
    const token = localStorage.getItem('token');
    return fetch('/L1000/api/v1/users/verify', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        dispatch(loginUserSuccess(token));
      }
    });
  };
}

export function loginUser(email, password, redirect = '/', replaceRoute = false) {
  return (dispatch) => {
    dispatch(loginUserRequest());
    return fetch('/L1000/api/v1/users/login', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => handleResponse(response))
    .then(response => response.json())
    .then(response => {
      try {
        dispatch(loginUserSuccess(response.token));
        if (replaceRoute) {
          dispatch(routeActions.replace(redirect));
        } else {
          dispatch(routeActions.push(redirect));
        }
      } catch (e) {
        dispatch(loginUserFailure({
          response: {
            status: 403,
            statusText: 'Invalid token',
          },
        }));
      }
    })
    .catch(error => {
      dispatch(loginUserFailure(error));
    });
  };
}

export function registerUserRequest() {
  return {
    type: REGISTER_USER_REQUEST,
  };
}

export function registerUser(email, password, name, address, phoneNumber, redirect = '/') {
  return (dispatch) => {
    dispatch(registerUserRequest());
    return fetch('/L1000/api/v1/users/register', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, address, phoneNumber }),
    })
    .then(response => handleResponse(response))
    .then(response => response.json())
    .then(response => {
      try {
        dispatch(loginUserSuccess(response.token));
        dispatch(routeActions.push(redirect));
      } catch (e) {
        dispatch(loginUserFailure({
          response: {
            status: 403,
            statusText: 'Invalid token',
          },
        }));
      }
    })
    .catch(error => {
      dispatch(loginUserFailure(error));
    });
  };
}

export function forgotPasswordRequest() {
  return {
    type: FORGOT_PASSWORD_REQUEST,
  };
}

export function forgotPasswordFailure(error) {
  return {
    type: FORGOT_PASSWORD_FAILURE,
    error,
  };
}

export function forgotPasswordSuccess() {
  return {
    type: FORGOT_PASSWORD_SUCCESS,
  };
}

export function forgotPassword(email) {
  return (dispatch) => {
    dispatch(forgotPasswordRequest());
    return fetch('/L1000/api/v1/users/password/forgot', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    .then(response => handleResponse(response))
    .then(() => {
      try {
        dispatch(forgotPasswordSuccess());
      } catch (e) {
        dispatch(forgotPasswordFailure(new Error(e)));
      }
    })
    .catch(e => {
      dispatch(forgotPasswordFailure(e));
    });
  };
}

export function getUserFromResetTokenRequest() {
  return {
    type: GET_USER_FROM_RESET_TOKEN_REQUEST,
  };
}

export function getUserFromResetTokenFailure(error) {
  return {
    type: GET_USER_FROM_RESET_TOKEN_FAILURE,
    error,
  };
}

export function getUserFromResetTokenSuccess(user) {
  return {
    type: GET_USER_FROM_RESET_TOKEN_SUCCESS,
    payload: { user },
  };
}

export function getUserFromResetToken(resetToken) {
  return (dispatch) => {
    dispatch(getUserFromResetTokenRequest());
    return fetch(`/L1000/api/v1/users/reset/token/${resetToken}`)
      .then(response => handleResponse(response))
      .then(response => response.json())
      .then(response => {
        try {
          dispatch(getUserFromResetTokenSuccess(response));
        } catch (e) {
          dispatch(getUserFromResetTokenFailure(new Error(e)));
        }
      })
      .catch(e => {
        dispatch(getUserFromResetTokenFailure(e));
      });
  };
}

export function resetPasswordRequest() {
  return {
    type: CHECK_EMAIL_AVAILABLE_REQUEST,
  };
}

export function resetPasswordFailure(error) {
  return {
    type: CHECK_EMAIL_AVAILABLE_FAILURE,
    error,
  };
}

export function resetPasswordSuccess() {
  return {
    type: CHECK_EMAIL_AVAILABLE_SUCCESS,
  };
}

export function resetPassword(oldPassword, newPassword) {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) {
      const err = new Error('Token required to reset password.');
      dispatch(resetPasswordFailure(err));
      return Promise.reject(err);
    }
    dispatch(resetPasswordRequest());
    return fetch('/L1000/api/v1/users/password/reset', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
    .then(response => handleResponse(response))
    .then(() => {
      try {
        dispatch(resetPasswordSuccess());
      } catch (e) {
        dispatch(resetPasswordFailure(new Error(e)));
      }
    })
    .catch(e => {
      dispatch(resetPasswordFailure(e));
    });
  };
}
