/* @flow */
import { applyMiddleware, createStore } from 'redux';
import { syncHistory } from 'react-router-redux';
import thunk from 'redux-thunk';

import rootReducer from 'reducers';
import api from 'middleware/api';

export default function configureStore(config: Object): Object {
  const { history } = config;
  const initialState = config.initialState || {};
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, api, syncHistory(history))
  );
}
