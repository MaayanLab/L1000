/* @flow */
import { applyMiddleware, compose, createStore } from 'redux';
import { syncHistory } from 'react-router-redux';
import thunk from 'redux-thunk';

import rootReducer from 'reducers';
import api from 'middleware/api';

export default function configureStore(config: Object): Object {
  const { history } = config;
  const initialState = config.initialState || {};
  // Sync with router via history instance (main.js)
  const routerMiddleware = syncHistory(history);

  // Compose final middleware and use devtools
  const devTools = window.devToolsExtension
    ? window.devToolsExtension()
    : require('containers/DevTools').default.instrument();

  // Create final store and subscribe router in debug env ie. for devtools
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, api, routerMiddleware),
      devTools
    )
  );

  routerMiddleware.listenForReplays(store, ({ router }) => router.location);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
