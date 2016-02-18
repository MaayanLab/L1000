/* eslint no-param-reassign:0 */
import monk from 'monk';
// import _debug from 'debug';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';

import config from '../serverConf';
import { createToken, getUserFromHeader } from '../utils';

// const debug = _debug('app:server:controllers:cart');
const db = monk(config.dbUrl);
const Users = db.get('users');
const Experiments = db.get('experiments');
const Compounds = db.get('compounds');

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
    const updatedUser = await Users.findAndModify({ _id: user._id }, { $set: { cart } });
    ctx.body = omit(updatedUser, 'password');
  } else {
    let itemExists = false;
    const newCartItems = user.cart.items.map((itemObj) => {
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
    let subTotal = 0.00;
    newCartItems.forEach((item) => subTotal += item.price);
    const cart = { ...user.cart, items: newCartItems, subTotal };
    // Need to create a new token with new user
    const updatedUser = await Users.findAndModify({ _id: user._id }, { $set: { cart } });
    const userWOPassword = omit(updatedUser, 'password');
    ctx.body = {
      token: createToken(userWOPassword),
      user: userWOPassword,
    };
  }
}

export async function removeFromCart(ctx) {
  if (ctx.method !== 'POST') {
    ctx.throw(400, 'Bad Request');
  }
  const { cartId } = ctx.request.body;
  if (!cartId) {
    ctx.throw(400, 'Cart Id not sent with request.');
  }
  const userFromToken = await getUserFromHeader(ctx);
  const user = await Users.findById(userFromToken._id);
  const cart = user.cart;
  const removeIndex = cart.items.map((item) => item.cartId).indexOf(cartId);
  if (removeIndex > -1) {
    cart.items.splice(removeIndex, 1);
    // Need to create a new token with new user
    const updatedUser = await Users.findAndModify({ _id: user._id }, { $set: { cart } });
    const userWOPassword = omit(updatedUser, 'password');
    ctx.body = {
      token: createToken(userWOPassword),
      user: userWOPassword,
    };
  } else {
    ctx.throw(400, 'Item does not exist in cart.');
  }
}

export async function updateQuantity(ctx) {
  if (ctx.method !== 'POST') {
    ctx.throw(400, 'Bad Request');
  }
  const { cartId } = ctx.request.body;
  const newQuantity = parseInt(ctx.request.body.newQuantity, 10);
  if (newQuantity < 1) {
    removeFromCart(ctx);
    return;
  }
  if (cartId === undefined || !newQuantity) {
    ctx.throw(400, 'Cart Id or newQuantity not sent with request.');
  }
  const userFromToken = await getUserFromHeader(ctx);
  const user = await Users.findById(userFromToken._id);
  let itemExists = false;
  const newCartItems = user.cart.items.map((item) => {
    if (item.cartId === cartId) {
      itemExists = true;
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
  if (!itemExists) {
    ctx.throw(400, 'Item does not exist in cart.');
  }
  // For some reason, findAndModify does not work here.
  // Update the user and if the update is successful, set the new cart items
  // On the original user and send that user back in the response.
  const updateUser = await Users.updateById(user._id, {
    $set: {
      'cart.items': newCartItems,
    },
  });
  if (!updateUser) {
    ctx.throw(500, 'User not updated.');
  }
  user.cart.items = newCartItems;
  // Need to create a new token with new user
  const userWOPassword = omit(user, 'password');
  ctx.body = {
    token: createToken(userWOPassword),
    user: userWOPassword,
  };
}
