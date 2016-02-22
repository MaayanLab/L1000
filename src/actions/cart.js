// import { CALL_API, Schemas } from 'middleware/api';
import { updateUser } from 'actions/auth';
import handleResponse from 'utils/handleResponse';

export const ADD_TO_CART_REQUEST = 'ADD_TO_CART_REQUEST';
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_FAILURE = 'ADD_TO_CART_FAILURE';

export const REMOVE_ITEM_FROM_CART_REQUEST = 'REMOVE_ITEM_FROM_CART_REQUEST';
export const REMOVE_ITEM_FROM_CART_SUCCESS = 'REMOVE_ITEM_FROM_CART_SUCCESS';
export const REMOVE_ITEM_FROM_CART_FAILURE = 'REMOVE_ITEM_FROM_CART_FAILURE';

export const UPDATE_QUANTITY_REQUEST = 'UPDATE_QUANTITY_REQUEST';
export const UPDATE_QUANTITY_SUCCESS = 'UPDATE_QUANTITY_SUCCESS';
export const UPDATE_QUANTITY_FAILURE = 'UPDATE_QUANTITY_FAILURE';

export const CHECKOUT_REQUEST = 'CHECKOUT_REQUEST';
export const CHECKOUT_FAILURE = 'CHECKOUT_FAILURE';
export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS';

function addToCartRequest() {
  return { type: ADD_TO_CART_REQUEST };
}

function addToCartSuccess() {
  return { type: ADD_TO_CART_SUCCESS };
}

function addToCartFailure(error) {
  return {
    type: ADD_TO_CART_FAILURE,
    error,
  };
}


export function addToCart(compound, experimentId) {
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
      body: JSON.stringify({ compound, experimentId }),
    })
      .then(response => handleResponse(response))
      .then(response => response.json())
      .then(response => {
        dispatch(addToCartSuccess());
        dispatch(updateUser(response));
      })
      .catch(e => dispatch(addToCartFailure(e)));
  };
}

function removeItemFromCartRequest() {
  return { type: REMOVE_ITEM_FROM_CART_REQUEST };
}

function removeItemFromCartSuccess(updatedCart) {
  return {
    type: REMOVE_ITEM_FROM_CART_SUCCESS,
    payload: {
      cart: updatedCart,
    },
  };
}

function removeItemFromCartFailure(error) {
  return {
    type: REMOVE_ITEM_FROM_CART_FAILURE,
    error,
  };
}


export function removeItemFromCart(cartId) {
  return (dispatch, getState) => {
    const { token } = getState().auth;
    dispatch(removeItemFromCartRequest());
    return fetch('/L1000/api/v1/users/cart/remove', {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ cartId }),
    })
      .then(response => handleResponse(response))
      .then(response => response.json())
      .then(response => {
        dispatch(removeItemFromCartSuccess());
        dispatch(updateUser(response));
      })
      .catch(e => dispatch(removeItemFromCartFailure(e)));
  };
}

function updateQuantityRequest() {
  return { type: UPDATE_QUANTITY_REQUEST };
}

function updateQuantitySuccess() {
  return { type: UPDATE_QUANTITY_SUCCESS };
}

function updateQuantityFailure(error) {
  return {
    type: UPDATE_QUANTITY_FAILURE,
    error,
  };
}


export function updateQuantity(cartId, newQuantity) {
  return (dispatch, getState) => {
    const { token } = getState().auth;
    dispatch(updateQuantityRequest());
    return fetch(`/L1000/api/v1/users/cart/quantity/update`, {
      method: 'post',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: token ? `Bearer ${token}` : undefined,
      },
      body: JSON.stringify({ cartId, newQuantity }),
    })
      .then(response => handleResponse(response))
      .then(response => response.json())
      .then(response => {
        dispatch(updateQuantitySuccess());
        dispatch(updateUser(response));
      })
      .catch(e => dispatch(updateQuantityFailure(e)));
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
