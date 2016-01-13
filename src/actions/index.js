/* @flow */
import { CALL_API, Schemas } from '../middleware/api';

export const EXPERIMENT_REQUEST = 'EXPERIMENT_REQUEST';
export const EXPERIMENT_SUCCESS = 'EXPERIMENT_SUCCESS';
export const EXPERIMENT_FAILURE = 'EXPERIMENT_FAILURE';

// Fetches a single experiment from API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchExperiment(experimentId) {
  return {
    [CALL_API]: {
      types: [EXPERIMENT_REQUEST, EXPERIMENT_SUCCESS, EXPERIMENT_FAILURE],
      endpoint: `experiments/${experimentId}`,
      schema: Schemas.EXPERIMENT,
    },
  };
}

// Fetches a single experiment from API unless it is cached.
// Relies on Redux Thunk middleware.
export function loadExperiment(experimentId, requiredFields = []) {
  return (dispatch, getState) => {
    const experiment = getState().entities.experiments[experimentId];
    if (experiment && requiredFields.every(key => experiment.hasOwnProperty(key))) {
      return null;
    }

    return dispatch(fetchExperiment(experimentId));
  };
}

export const EXPERIMENTS_REQUEST = 'EXPERIMENTS_REQUEST';
export const EXPERIMENTS_SUCCESS = 'EXPERIMENTS_SUCCESS';
export const EXPERIMENTS_FAILURE = 'EXPERIMENTS_FAILURE';

// Fetches a single experiment from API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchExperiments() {
  return {
    [CALL_API]: {
      types: [EXPERIMENTS_REQUEST, EXPERIMENTS_SUCCESS, EXPERIMENTS_FAILURE],
      endpoint: `experiments`,
      schema: Schemas.EXPERIMENT_ARRAY,
    },
  };
}

// Relies on Redux Thunk middleware.
export function loadExperiments() {
  // return fetchExperiments();
  return (dispatch) => {
    return dispatch(fetchExperiments());
  };
}

export const COMPOUNDS_REQUEST = 'COMPOUNDS_REQUEST';
export const COMPOUNDS_SUCCESS = 'COMPOUNDS_SUCCESS';
export const COMPOUNDS_FAILURE = 'COMPOUNDS_FAILURE';

// Fetches a single experiment from API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchCompounds() {
  return {
    [CALL_API]: {
      types: [COMPOUNDS_REQUEST, COMPOUNDS_SUCCESS, COMPOUNDS_FAILURE],
      endpoint: `experiments`,
      schema: Schemas.COMPOUND_ARRAY,
    },
  };
}

// Fetches experiments from API unless they are cached.
// Relies on Redux Thunk middleware.
export function loadCompounds(experimentId, requiredFields = []) {
  return (dispatch, getState) => {
    const experiment = getState().entities.experiments[experimentId];
    if (experiment && requiredFields.every(key => experiment.hasOwnProperty(key))) {
      return null;
    }

    return dispatch(fetchCompounds(experimentId));
  };
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE,
  };
}
