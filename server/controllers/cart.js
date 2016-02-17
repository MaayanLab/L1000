/* eslint no-param-reassign:0 */
import monk from 'monk';
// import _debug from 'debug';
import config from '../serverConf';
import { getUserFromHeader } from '../utils';

// const debug = _debug('app:server:controllers:cart');
const db = monk(config.dbUrl);
const Users = db.get('users');
const Experiments = db.get('experiments');

export async function addToCart(ctx) {
  if (ctx.method !== 'POST') {
    return;
  }
  const { compoundId, experimentId } = ctx.request.body;
  const experiment = await Experiments.findById(experimentId);
  const isSingleDose = experiment.type === 'Single Dose';
  if (!compoundId || !experimentId) {
    ctx.throw(400, 'Compound Id or Experiment Id not sent with request.');
  }
  const userFromToken = await getUserFromHeader(ctx);
  const user = await Users.findById(userFromToken._id);
  if (!user.cart) {
    const price = isSingleDose ? 300 : 1500;
    const cart = {
      items: [{
        cartId: 1,
        compoundId,
        experimentId,
        price,
        quantity: 1,
      }],
      subTotal: price,
    };
    ctx.body = await Users.findAndModify({ _id: user._id }, { $set: { cart } });
  } else {
    let itemExists = false;
    const newCartItems = user.cart.items((itemObj) => {
      if (itemObj.compoundId && itemObj.compoundId === compoundId &&
        itemObj.experimentId && itemObj.experimentId === experimentId) {
        itemExists = true;
        itemObj.quantity++;
      }
      return itemObj;
    });
    if (!itemExists) {
      newCartItems.push({
        cartId: newCartItems.reduce((maxId, cartItem) => Math.max(cartItem.cartId, maxId), -1) + 1,
        compoundId,
        experimentId,
        quantity: 1,
      });
    }
    let subTotal = 0;
    newCartItems.forEach((item) => subTotal += item.price);
    const cart = { ...user.cart, items: newCartItems, subTotal };
    ctx.body = await Users.findAndModify({ _id: user._id }, { $set: { cart } });
  }
}

export async function removeFromCart(ctx) {
  if (ctx.method !== 'POST') {
    return;
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
    ctx.body = await Users.findAndModify({ _id: user._id }, { $set: { cart } });
  } else {
    ctx.throw(400, 'Item does not exist in cart.');
  }
}
