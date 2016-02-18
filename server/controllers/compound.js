/* eslint no-param-reassign:0 */
import monk from 'monk';
// import _debug from 'debug';
import config from '../serverConf';

// const debug = _debug('app:server:controllers:compound');
const db = monk(config.dbUrl);
const Compounds = db.get('compounds');

export async function findAll(ctx) {
  if (ctx.method !== 'GET') {
    ctx.throw(400, 'Bad Request');
  }
  ctx.body = await Compounds.find({});
}

export async function findById(ctx, id) {
  if (ctx.method !== 'GET') {
    ctx.throw(400, 'Bad Request');
  }
  ctx.body = await Compounds.findById(id);
}
