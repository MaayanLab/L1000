import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import merge from 'lodash/object/merge';
import auth from './auth';
import * as ActionTypes from '../actions';

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

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
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
        case ActionTypes.LOGIN_USER_SUCCESS:
          return undefined;
        case ActionTypes.LOGIN_USER_FAILURE:
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
        case ActionTypes.ADD_COMPOUND_SUCCESS:
          return undefined;
        default:
          return state;
      }
    },
  }),
});
