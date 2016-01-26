import * as ActionTypes from '../actions';
// import { pushPath } from 'react-router-redux';
import jwtDecode from 'jwt-decode';

const initialState = {
  token: null,
  user: {},
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_USER_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
        statusText: null,
      };
    case ActionTypes.LOGIN_USER_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: jwtDecode(action.payload.token),
        statusText: 'You have been successfully logged in.',
      };
    case ActionTypes.LOGIN_USER_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        user: {},
        statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`,
      };
    case ActionTypes.LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        user: {},
        statusText: 'You have been successfully logged out.',
      };
    default:
      return state;
  }
};
