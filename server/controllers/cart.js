/* eslint no-param-reassign:0 */
import monk from 'monk';
// import _debug from 'debug';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import filter from 'lodash/filter';

import config from '../serverConf';
import { createToken, getUserFromHeader } from '../utils';

// const debug = _debug('app:server:controllers:cart');
const db = monk(config.dbUrl);
const Users = db.get('users');
const Experiments = db.get('experiments');
const Compounds = db.get('compounds');

function calcCartSubtotal(cart) {
  let subTotal = 0.00;
  cart.items.forEach((item) => subTotal += item.price * item.quantity);
  return subTotal;
}

export async function addToCart(ctx) {
  if (ctx.method !== 'POST') {
    ctx.throw(400, 'Bad Request');
  }
  const { experimentId } = ctx.request.body;
  const compound = await Compounds.insert(ctx.request.body.compound);
  const experiment = await Experiments.findById(experimentId);

  const isSingleDose = experiment.type === 'Single Dose';
  const price = isSingleDose ? 300.00 : 1500.00;
  if (!compound || !experimentId) {
    ctx.throw(400, 'Compound or Experiment Id not sent with request.');
  }
  const userFromToken = await getUserFromHeader(ctx);
  const user = await Users.findById(userFromToken._id);
  if (!user.cart || Object.keys(user.cart).length < 1) {
    const cart = {
      items: [{
        cartId: 1,
        compoundId: compound._id,
        experimentId,
        price,
        quantity: 1,
      }],
      subTotal: price,
    };
    // Need to create a new token with new user
    // For some reason, findAndModify does not work here.
    // Update the user and if the update is successful, set the new cart items
    // On the original user and send that user back in the response.
    const updateUser = await Users.updateById(user._id, { $set: { cart } });
    if (!updateUser) {
      ctx.throw(500, 'User not updated.');
    }
    user.cart = cart;
    // Need to create a new token with new user
    const userWOPassword = omit(user, 'password');
    ctx.body = {
      token: createToken(userWOPassword),
      user: userWOPassword,
    };
  } else {
    let itemExists = false;
    const cart = user.cart;
    const newCartItems = cart.items.map((itemObj) => {
      if (itemObj.compound && isEqual(itemObj.compound, compound) &&
        itemObj.experimentId && itemObj.experimentId === experimentId) {
        itemExists = true;
        itemObj.quantity++;
      }
      return itemObj;
    });
    if (!itemExists) {
      newCartItems.push({
        cartId: newCartItems.reduce((maxId, cartItem) => Math.max(cartItem.cartId, maxId), -1) + 1,
        compoundId: compound._id,
        experimentId,
        quantity: 1,
        price,
      });
    }
    cart.items = newCartItems;
    cart.subTotal = calcCartSubtotal(cart);

    // Need to create a new token with new user
    // For some reason, findAndModify does not work here.
    // Update the user and if the update is successful, set the new cart items
    // On the original user and send that user back in the response.
    const updateUser = await Users.updateById(user._id, { $set: { cart } });
    if (!updateUser) {
      ctx.throw(500, 'User not updated.');
    }
    user.cart = cart;
    // Need to create a new token with new user
    const userWOPassword = omit(user, 'password');
    ctx.body = {
      token: createToken(userWOPassword),
      user: userWOPassword,
    };
  }
}

export async function removeItemFromCart(ctx) {
  if (ctx.method !== 'POST') {
    ctx.throw(400, 'Bad Request');
  }
  const { cartId } = ctx.request.body;
  if (cartId === undefined) {
    ctx.throw(400, 'Cart Id not sent with request.');
  }
  const userFromToken = await getUserFromHeader(ctx);
  const user = await Users.findById(userFromToken._id);
  const cart = user.cart;
  const newCartItems = filter(cart.items, (item) => item.cartId !== cartId);
  cart.items = newCartItems;
  cart.subTotal = calcCartSubtotal(cart);
  // Need to create a new token with new user
  // For some reason, findAndModify does not work here.
  // Update the user and if the update is successful, set the new cart items
  // On the original user and send that user back in the response.
  const updateUser = await Users.updateById(user._id, { $set: { cart } });
  if (!updateUser) {
    ctx.throw(500, 'User not updated.');
  }
  user.cart = cart;
  // Need to create a new token with new user
  const userWOPassword = omit(user, 'password');
  ctx.body = {
    token: createToken(userWOPassword),
    user: userWOPassword,
  };
}

export async function updateQuantity(ctx) {
  if (ctx.method !== 'POST') {
    ctx.throw(400, 'Bad Request');
  }
  const { cartId } = ctx.request.body;
  const newQuantity = parseInt(ctx.request.body.newQuantity, 10);
  if (newQuantity < 1) {
    removeItemFromCart(ctx);
    return;
  }
  if (cartId === undefined || !newQuantity) {
    ctx.throw(400, 'Cart Id or newQuantity not sent with request.');
  }
  const userFromToken = await getUserFromHeader(ctx);
  const user = await Users.findById(userFromToken._id);
  const cart = user.cart;
  let itemExists = false;
  const newCartItems = cart.items.map((item) => {
    if (item.cartId === cartId) {
      itemExists = true;
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
  if (!itemExists) {
    ctx.throw(400, 'Item does not exist in cart.');
  }
  cart.items = newCartItems;
  cart.subTotal = calcCartSubtotal(cart);
  // For some reason, findAndModify does not work here.
  // Update the user and if the update is successful, set the new cart items
  // On the original user and send that user back in the response.
  const updateUser = await Users.updateById(user._id, { $set: { cart } });
  if (!updateUser) {
    ctx.throw(500, 'User not updated.');
  }
  // Need to create a new token with new user
  const userWOPassword = omit(user, 'password');
  ctx.body = {
    token: createToken(userWOPassword),
    user: userWOPassword,
  };
}
