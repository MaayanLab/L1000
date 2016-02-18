// import { pushPath } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import extend from 'extend';
import * as AuthActionTypes from 'actions/auth';

const initialState = {
  token: null,
  user: {
    email: '',
    name: '',
    address: '',
    phoneNumber: '',
    cart: {
      items: [],
      subTotal: 0.00,
      shippingMethod: '',
      shippingCost: 0.00,
      tax: 0.00,
    },
  },
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AuthActionTypes.REGISTER_USER_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
        statusText: null,
      };
    case AuthActionTypes.LOGIN_USER_REQUEST:
      return {
        ...state,
        isAuthenticating: true,
        statusText: null,
      };
    case AuthActionTypes.LOGIN_USER_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        token: action.payload.token,
        user: extend(true, {}, state.user, jwtDecode(action.payload.token)),
        statusText: 'You have been successfully logged in.',
      };
    case AuthActionTypes.LOGIN_USER_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        user: {},
        statusText: `Authentication Error: ${action.payload.status} ${action.payload.statusText}`,
      };
    case AuthActionTypes.UPDATE_USER:
      console.log(action.payload.user);
      return {
        ...state,
        user: extend(true, {}, state.user, action.payload.user),
      };
    case AuthActionTypes.LOGOUT_USER:
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
