/* eslint no-param-reassign:0 */
// import _debug from 'debug';
// const debug = _debug('app:server:controllers:compound');
import Compound from '../models/Compound';

export async function findAll(ctx) {
  if (ctx.method !== 'GET') {
    ctx.throw(400, 'Bad Request');
  }
  ctx.body = await Compound.find({}).lean().exec();
}

export async function findById(ctx, id) {
  if (ctx.method !== 'GET') {
    ctx.throw(400, 'Bad Request');
  }
  ctx.body = await Compound.findById(id).lean().exec();
}
