import _debug from 'debug';
import route from 'koa-route';
import jwt from 'koa-jwt';
import convert from 'koa-convert';
import * as experiment from '../controllers/experiment';
import * as compound from '../controllers/compound';
import * as user from '../controllers/user';
import * as cart from '../controllers/cart';
import config from '../serverConf';

const debug = _debug('app:server:routes');

const BASE = '/L1000/api/v1';

export default function routes(app) {
  debug('Requiring routes...');
  // Unprotected Routes

  // Users
  app.use(route.get(`${BASE}/users/reset/token/:resetToken`, user.getUserFromResetToken));
  app.use(route.post(`${BASE}/users/emailAvailable`, user.checkEmailAvailable));
  app.use(route.post(`${BASE}/users/password/forgot`, user.forgotPassword));
  app.use(route.post(`${BASE}/users/register`, user.register));
  app.use(route.post(`${BASE}/users/login`, user.login));
  app.use(route.post(`${BASE}/users/verify`, user.verifyToken));

  // Experiments
  app.use(route.get(`${BASE}/experiments`, experiment.findAll));
  app.use(route.get(`${BASE}/experiments/:id`, experiment.findById));
  app.use(route.get(`${BASE}/experiments/completed`, experiment.findCompleted));
  app.use(route.get(`${BASE}/experiments/available`, experiment.findWithAvailableSpots));

  // Compounds
  app.use(route.get(`${BASE}/compounds`, compound.findAll));
  app.use(route.get(`${BASE}/compounds/:id`, compound.findById));

  // Protected Routes

  // Check for a valid JWT in header
  app.use(convert(jwt({
    secret: config.secret,
    issuer: 'http://amp.pharm.mssm.edu/L1000/',
    passthrough: true,
  })));

  // Users
  app.use(route.post(`${BASE}/users/password/reset`, user.resetPassword));

  // Cart
  app.use(route.post(`${BASE}/users/cart/add`, cart.addToCart));
  app.use(route.post(`${BASE}/users/cart/remove`, cart.removeItemFromCart));
  app.use(route.post(`${BASE}/users/cart/quantity/update`, cart.updateQuantity));

  // Experiments
  app.use(route.post(`${BASE}/experiments/add`, experiment.addExperiment));
  app.use(route.del(`${BASE}/experiments/:id/remove`, experiment.removeExperiment));
  app.use(route.post(`${BASE}/experiments/:id/compounds/add`, experiment.addCompound));
}
