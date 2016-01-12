/* @flow */
import { createAction, handleActions } from 'redux-actions';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_COMPOUND = 'ADD_COMPOUND';
export const REMOVE_COMPOUND = 'REMOVE_COMPOUND';

// ------------------------------------
// Actions
// ------------------------------------
export const addCompound = createAction(ADD_COMPOUND, (compound = {}): Object => compound);

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [ADD_COMPOUND]: (state, { payload }) => ([
    ...state,
    payload,
  ]),
}, []);
