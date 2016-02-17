import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';
import Modal from 'react-modal';

import makeRoutes from './routes';
import Root from 'containers/Root';
import configureStore from 'store/configureStore';
import { loadExperiments } from 'actions/entities';
import { attemptLoginFromToken } from 'actions/auth';

const historyConfig = { basename: __BASENAME__ };
const history = useRouterHistory(createHistory)(historyConfig);

const initialState = window.__INITIAL_STATE__;
const store = configureStore({ initialState, history });

// Load experiments
store.dispatch(loadExperiments());

// Attempt to login user from token if it exists
const token = localStorage.getItem('token');
if (token) {
  store.dispatch(attemptLoginFromToken(token));
}

// Bootstrap routes
const routes = makeRoutes(store);

const mountNode = document.getElementById('root');

// Let react-modal know where our app is mounted.
Modal.setAppElement(mountNode);

// Render to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  mountNode
);
