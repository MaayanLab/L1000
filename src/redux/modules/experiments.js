/* @flow */
import axios from 'axios';
import { createAction, handleActions } from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_ALL_EXPERIMENTS = 'REQUEST_ALL_EXPERIMENTS';
export const EXPERIMENTS_ERROR = 'EXPERIMENTS_ERROR';
export const EXPERIMENTS_RECEIVED = 'EXPERIMENTS_RECEIVED';

// ------------------------------------
// Actions
// ------------------------------------
export const requestAllExperiments = createAction(REQUEST_ALL_EXPERIMENTS);
export const experimentsError = createAction(EXPERIMENTS_ERROR, (error: Error) => error);
export const experimentsReceived = createAction(
  EXPERIMENTS_RECEIVED,
  (data = []): Array<Object> => data
);

// This is a thunk, meaning it is a function that immediately
// returns a function for lazy evaluation. It is incredibly useful for
// creating async actions, especially when combined with redux-thunk!
// NOTE: This is solely for demonstration purposes. In a real application,
// you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
// reducer take care of this logic.
// export const doubleAsync = () => {
//   return (dispatch, getState) => {
//     setTimeout(() => {
//       dispatch(increment(getState().counter));
//     }, 1000);
//   };
// };

export function fetchExperiments(endpoint = '') {
  return (dispatch) => {
    dispatch(requestAllExperiments());
    return axios
      .get(`http://localhost:3000/L1000/api/v1/experiments/${endpoint}`)
      .then(response => {
        dispatch(experimentsReceived(response.data));
      })
      .catch(response => {
        if (response instanceof Error) {
          dispatch(experimentsError(response));
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          dispatch(experimentsError(error));
        }
      });
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [REQUEST_ALL_EXPERIMENTS]: (state) => ({
    ...state,
    isFetching: true,
  }),
  [EXPERIMENTS_RECEIVED]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    data: payload,
  }),
  [EXPERIMENTS_ERROR]: (state, { payload }) => ({
    ...state,
    isFetching: false,
    error: payload,
  }),
}, {
  isFetching: false,
  data: [],
  error: null,
});
