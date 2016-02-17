// import { CALL_API, Schemas } from 'middleware/api';
import handleResponse from 'utils/handleResponse';

export const ADD_TO_CART_REQUEST = 'ADD_TO_CART_REQUEST';
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_FAILURE = 'ADD_TO_CART_FAILURE';

export const REMOVE_FROM_CART_REQUEST = 'REMOVE_FROM_CART_REQUEST';
export const REMOVE_FROM_CART_SUCCESS = 'REMOVE_FROM_CART_SUCCESS';
export const REMOVE_FROM_CART_FAILURE = 'REMOVE_FROM_CART_FAILURE';

export const CHECKOUT_REQUEST = 'CHECKOUT_REQUEST';
export const CHECKOUT_FAILURE = 'CHECKOUT_FAILURE';
export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS';

function addToCartRequest() {
  return { type: ADD_TO_CART_REQUEST };
}

function addToCartSuccess(updatedCart) {
  return {
    type: ADD_TO_CART_SUCCESS,
    payload: {
      cart: updatedCart,
    },
  };
}

function addToCartFailure(error) {
  return {
    type: ADD_TO_CART_FAILURE,
    error,
  };
}


export function addToCart(compoundId, experimentId) {
  return (dispatch, getState) => {
    const { token } = getState().auth;
    dispatch(addToCartRequest());
    return fetch('/L1000/api/v1/users/cart/add', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ compoundId, experimentId }),
    })
      .then(response => handleResponse(response))
      .then(response => response.json())
      .then(response => dispatch(addToCartSuccess(response.cart)))
      .catch(e => dispatch(addToCartFailure(e)));
  };
}

function removeFromCartRequest() {
  return { type: REMOVE_FROM_CART_REQUEST };
}

function removeFromCartSuccess(updatedCart) {
  return {
    type: REMOVE_FROM_CART_SUCCESS,
    payload: {
      cart: updatedCart,
    },
  };
}

function removeFromCartFailure(error) {
  return {
    type: REMOVE_FROM_CART_FAILURE,
    error,
  };
}


export function removeFromCart(compoundId, experimentId) {
  return (dispatch, getState) => {
    const { token } = getState().auth;
    dispatch(removeFromCartRequest());
    return fetch('/L1000/api/v1/users/cart/remove', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ compoundId, experimentId }),
    })
      .then(response => handleResponse(response))
      .then(response => response.json())
      .then(response => dispatch(removeFromCartSuccess(response.cart)))
      .catch(e => dispatch(removeFromCartFailure(e)));
  };
}

export function checkoutRequest() {
  return { type: CHECKOUT_REQUEST };
}

export function checkoutSuccess(cart) {
  return {
    type: CHECKOUT_SUCCESS,
    cart,
  };
}

export function checkoutFailure() {
  return { type: CHECKOUT_FAILURE };
}

export function checkout() {
  return (dispatch, getState) => {
    const cart = getState().cart;

    dispatch(checkoutRequest());
    // shop.buyProducts(products, () => {
    dispatch(checkoutSuccess(cart));
      // Replace the line above with line below to rollback on failure:
      // dispatch({ type: types.CHECKOUT_FAILURE, cart })
    // })
  };
}
