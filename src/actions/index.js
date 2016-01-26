/* @flow */
import { CALL_API, Schemas } from '../middleware/api';
import { pushPath } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
// import isEqual from 'lodash/lang/isEqual';

export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';

export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';

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

export const LOGOUT_USER = 'LOGOUT_USER';

export function logout() {
  localStorage.removeItem('token');
  return {
    type: LOGOUT_USER,
  };
}

export function logoutAndRedirect() {
  return (dispatch) => {
    dispatch(logout());
    dispatch(pushPath('/'));
  };
}

export function loginUser(email, password, redirect = '/') {
  return (dispatch) => {
    dispatch(loginUserRequest());
    return fetch('http://localhost:3000/L1000/api/v1/login', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    })
    .then(response => response.json())
    .then(response => {
      try {
        dispatch(loginUserSuccess(response.token));
        dispatch(pushPath(redirect));
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
    return fetch('http://localhost:3000/L1000/api/v1/register', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, address, phoneNumber }),
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    })
    .then(response => response.json())
    .then(response => {
      try {
        dispatch(loginUserSuccess(response.token));
        dispatch(pushPath(redirect));
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

export const EXPERIMENT_REQUEST = 'EXPERIMENT_REQUEST';
export const EXPERIMENT_SUCCESS = 'EXPERIMENT_SUCCESS';
export const EXPERIMENT_FAILURE = 'EXPERIMENT_FAILURE';

// Fetches a single experiment from API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchExperiment(experimentId) {
  return {
    [CALL_API]: {
      types: [EXPERIMENT_REQUEST, EXPERIMENT_SUCCESS, EXPERIMENT_FAILURE],
      endpoint: `experiments/${experimentId}`,
      schema: Schemas.EXPERIMENT,
    },
  };
}

// Fetches a single experiment from API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadExperiment(experimentId, requiredFields = []) {
  return (dispatch, getState) => {
    const experiment = getState().entities.experiments[experimentId];
    if (experiment && requiredFields.every(key => experiment.hasOwnProperty(key))) {
      return null;
    }

    return dispatch(fetchExperiment(experimentId));
  };
}

export const EXPERIMENTS_REQUEST = 'EXPERIMENTS_REQUEST';
export const EXPERIMENTS_SUCCESS = 'EXPERIMENTS_SUCCESS';
export const EXPERIMENTS_FAILURE = 'EXPERIMENTS_FAILURE';

// Relies on Redux Thunk middleware.
export function loadExperiments() {
  // return fetchExperiments();
  return (dispatch) => {
    return dispatch({
      [CALL_API]: {
        types: [EXPERIMENTS_REQUEST, EXPERIMENTS_SUCCESS, EXPERIMENTS_FAILURE],
        endpoint: `experiments`,
        schema: Schemas.EXPERIMENT_ARRAY,
      },
    });
  };
}

export const ADD_COMPOUND_REQUEST = 'ADD_COMPOUND_REQUEST';
export const ADD_COMPOUND_SUCCESS = 'ADD_COMPOUND_SUCCESS';
export const ADD_COMPOUND_FAILURE = 'ADD_COMPOUND_FAILURE';


function addCompoundRequest(compound, experimentId) {
  return {
    [CALL_API]: {
      types: [ADD_COMPOUND_REQUEST, ADD_COMPOUND_SUCCESS, ADD_COMPOUND_FAILURE],
      endpoint: `experiments/${experimentId}/compounds/add`,
      schema: Schemas.EXPERIMENT,
      body: compound,
    },
  };
}

// Fetches a single experiment from API.
// Relies on the custom API middleware defined in ../middleware/api.js.
export function addCompound(compound, experimentId) {
  return (dispatch) => {
    // const compoundFromState = getState().entities.compounds[compound._id];
    // if (compoundFromState && isEqual(compound, compoundFromState)) {
    //   return null;
    // }
    return dispatch(addCompoundRequest(compound, experimentId));
  };
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE,
  };
}
