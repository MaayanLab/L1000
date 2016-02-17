import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import merge from 'lodash/merge';
import auth from './auth';
import * as AuthActionTypes from 'actions/auth';
import * as EntityActionTypes from 'actions/entities';

// Updates an entity cache in response to any action with response.entities.
function entities(state = { experiments: {}, compounds: {} }, action) {
  const { response } = action;
  if (response && response.entities) {
    return merge({}, state, response.entities);
  }
  return state;
}

// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  const { type, error } = action;

  if (type === EntityActionTypes.RESET_ERROR_MESSAGE) {
    return null;
  } else if (error) {
    return action.error;
  }
  return state;
}

export default combineReducers({
  entities,
  errorMessage,
  router,
  auth,
  form: formReducer.plugin({
    Login: (state, action) => {
      switch (action.type) {
        case AuthActionTypes.LOGIN_USER_SUCCESS:
          return undefined;
        case AuthActionTypes.LOGIN_USER_FAILURE:
          return {
            ...state,
            errorStatus: action.payload.status,
            errorText: action.payload.statusText,
          };
        default:
          return state;
      }
    },
    AddCompound: (state, action) => {
      switch (action.type) {
        case EntityActionTypes.ADD_COMPOUND_SUCCESS:
          return undefined;
        default:
          return state;
      }
    },
  }),
});
