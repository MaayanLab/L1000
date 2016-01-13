import { Schema, arrayOf, normalize } from 'normalizr';
import 'isomorphic-fetch';

let API_ROOT = '';

if (process.env.NODE_ENV === 'production') {
  API_ROOT = 'http://amp.pharm.mssm.edu/L1000/api/v1/';
} else {
  API_ROOT = 'http://localhost:3000/L1000/api/v1/';
}

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
function callApi(endpoint, schema) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;

  return fetch(fullUrl)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        // return Promise.reject(json);
        console.log(json);
      }
      return Object.assign({}, normalize(json, schema));
    });
}

// Normalize JSON response using normalizr

const compoundSchema = new Schema('compounds', {
  idAttribute: 'name',
});

const experimentSchema = new Schema('experiments', {
  idAttribute: '_id',
});

experimentSchema.define({
  compounds: arrayOf(compoundSchema),
});

// compoundSchema.define({
//   experiment: experimentSchema,
// });

// Schemas for API responses.
export const Schemas = {
  EXPERIMENT: experimentSchema,
  EXPERIMENT_ARRAY: arrayOf(experimentSchema),
  COMPOUND: compoundSchema,
  COMPOUND_ARRAY: arrayOf(compoundSchema),
};

export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { schema, types } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType,
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened',
    }))
  );
};
