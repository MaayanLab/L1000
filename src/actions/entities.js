import { CALL_API, Schemas } from 'middleware/api';

export const COMPOUND_REQUEST = 'COMPOUND_REQUEST';
export const COMPOUND_SUCCESS = 'COMPOUND_SUCCESS';
export const COMPOUND_FAILURE = 'COMPOUND_FAILURE';

export const COMPOUNDS_REQUEST = 'COMPOUNDS_REQUEST';
export const COMPOUNDS_SUCCESS = 'COMPOUNDS_SUCCESS';
export const COMPOUNDS_FAILURE = 'COMPOUNDS_FAILURE';

export const EXPERIMENT_REQUEST = 'EXPERIMENT_REQUEST';
export const EXPERIMENT_SUCCESS = 'EXPERIMENT_SUCCESS';
export const EXPERIMENT_FAILURE = 'EXPERIMENT_FAILURE';

export const EXPERIMENTS_REQUEST = 'EXPERIMENTS_REQUEST';
export const EXPERIMENTS_SUCCESS = 'EXPERIMENTS_SUCCESS';
export const EXPERIMENTS_FAILURE = 'EXPERIMENTS_FAILURE';

export const ADD_COMPOUND_REQUEST = 'ADD_COMPOUND_REQUEST';
export const ADD_COMPOUND_SUCCESS = 'ADD_COMPOUND_SUCCESS';
export const ADD_COMPOUND_FAILURE = 'ADD_COMPOUND_FAILURE';

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

// Fetches a single experiment from API.
// Relies on the custom API middleware defined in middleware/api.js.
function fetchCompound(compoundId) {
  return {
    [CALL_API]: {
      types: [EXPERIMENT_REQUEST, EXPERIMENT_SUCCESS, EXPERIMENT_FAILURE],
      endpoint: `compounds/${compoundId}`,
      schema: Schemas.EXPERIMENT,
    },
  };
}

// Fetches a single compound from API unless it is cached.
export function loadCompound(compoundId, requiredFields = []) {
  return (dispatch, getState) => {
    const compound = getState().entities.compounds[compoundId];
    if (compound && requiredFields.every(key => compound.hasOwnProperty(key))) {
      return null;
    }

    return dispatch(fetchCompound(compoundId));
  };
}

export function loadCompounds() {
  return (dispatch) =>
    dispatch({
      [CALL_API]: {
        types: [COMPOUNDS_REQUEST, COMPOUNDS_SUCCESS, COMPOUNDS_FAILURE],
        endpoint: `compounds`,
        schema: Schemas.COMPOUND_ARRAY,
      },
    });
}

// Fetches a single experiment from API.
// Relies on the custom API middleware defined in middleware/api.js.
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
export function loadExperiment(experimentId, requiredFields = []) {
  return (dispatch, getState) => {
    const experiment = getState().entities.experiments[experimentId];
    if (experiment && requiredFields.every(key => experiment.hasOwnProperty(key))) {
      return null;
    }

    return dispatch(fetchExperiment(experimentId));
  };
}

export function loadExperiments() {
  return (dispatch) =>
    dispatch({
      [CALL_API]: {
        types: [EXPERIMENTS_REQUEST, EXPERIMENTS_SUCCESS, EXPERIMENTS_FAILURE],
        endpoint: `experiments`,
        schema: Schemas.EXPERIMENT_ARRAY,
      },
    });
}

function addCompoundRequest(compound, experimentId) {
  return {
    [CALL_API]: {
      types: [ADD_COMPOUND_REQUEST, ADD_COMPOUND_SUCCESS, ADD_COMPOUND_FAILURE],
      endpoint: `experiments/${experimentId}/compounds/add`,
      schema: Schemas.EXPERIMENT,
      body: compound,
    },
  };
}

// Fetches a single experiment from API.
// Relies on the custom API middleware defined in ../middleware/api.js.
export function addCompound(compound, experimentId) {
  return (dispatch) =>
    // const compoundFromState = getState().entities.compounds[compound._id];
    // if (compoundFromState && isEqual(compound, compoundFromState)) {
    //   return null;
    // }
    dispatch(addCompoundRequest(compound, experimentId));
}

// Resets the currently visible error message.
export function resetErrorMessage() {
  return {
    type: RESET_ERROR_MESSAGE,
  };
}
