import * as CartActionTypes from 'actions/cart';
// import { pushPath } from 'react-router-redux';
import jwtDecode from 'jwt-decode';

const initialState = {
  items: [],
  subTotal: 0,
  total: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CartActionTypes.ADD_TO_CART:
      return {
        ...state,
        items: [
          ...state.items,
          {
            cartId: state.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1,
            ...action.item,
          },
        ],
        subTotal: state.subTotal + action.payload.price,
      };
    case CartActionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter(item => todo.cartId !== action.cartId),
        subTotal: state.subTotal - action.payload.price,
      };
    default:
      return state;
  }
};
