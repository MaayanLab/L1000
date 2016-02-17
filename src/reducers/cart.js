import * as CartActionTypes from 'actions/cart';
import extend from 'extend';
// import { pushPath } from 'react-router-redux';
// import jwtDecode from 'jwt-decode';

const initialState = {
  items: [],
  subTotal: 0,
  shippingMethod: '',
  shippingCost: 0,
  total: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CartActionTypes.ADD_TO_CART_SUCCESS:
      return extend(true, state, action.payload.cart);
    default:
      return state;
  }
};
