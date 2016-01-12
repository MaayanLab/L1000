import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import experiment from './modules/experiment';
import experiments from './modules/experiments';

export default combineReducers({
  experiment,
  experiments,
  router: routeReducer,
});
