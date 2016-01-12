/* @flow */
import axios from 'axios';
import { createAction, handleActions } from 'redux-actions';
import compounds, { ADD_COMPOUND } from './compounds';

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_ONE_EXPERIMENT = 'REQUEST_ONE_EXPERIMENT';
export const EXPERIMENT_ERROR = 'EXPERIMENT_ERROR';
export const EXPERIMENT_RECEIVED = 'EXPERIMENT_RECEIVED';

// ------------------------------------
// Actions
// ------------------------------------
export const requestOneExperiment = createAction(REQUEST_ONE_EXPERIMENT);
export const experimentError = createAction(EXPERIMENT_ERROR, (error: Error) => error);
export const experimentReceived = createAction(
  EXPERIMENT_RECEIVED,
  (data = {}): Object => data
);

export function fetchOneExperiment(experimentId) {
  return (dispatch) => {
    if (!experimentId) {
      const error = new Error('Experiment Id not provided to fetchExperiment');
      return dispatch(experimentError(error));
    }
    dispatch(requestOneExperiment());
    return axios
      .get(`http://localhost:3000/L1000/api/v1/experiment/${experimentId}`)
      .then(response => {
        dispatch(experimentReceived(response.data));
      })
      .catch(response => {
        if (response instanceof Error) {
          dispatch(experimentError(response));
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          dispatch(experimentError(error));
        }
      });
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [ADD_COMPOUND]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      compounds: compounds(state, action),
    },
  }),
  [REQUEST_ONE_EXPERIMENT]: (state) => ({
    ...state,
    isFetching: true,
  }),
  [EXPERIMENT_RECEIVED]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    data: payload,
  }),
  [EXPERIMENT_ERROR]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    error: payload,
  }),
}, {
  isFetching: false,
  data: {},
  error: null,
});
