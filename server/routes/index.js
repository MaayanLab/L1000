import _debug from 'debug';
import route from 'koa-route';
import jwt from 'koa-jwt';
import convert from 'koa-convert';
import * as experiments from '../controllers/experiment';
import * as users from '../controllers/user';
import config from '../serverConf';

const debug = _debug('app:server:routes');

const BASE = '/L1000/api/v1';

export default function routes(app) {
  debug('Requiring routes...');
  // Unprotected Routes

  // Users
  app.use(route.get(`${BASE}/users/reset/token/:resetToken`, users.getUserFromResetToken));
  app.use(route.post(`${BASE}/users/emailAvailable`, users.checkEmailAvailable));
  app.use(route.post(`${BASE}/users/password/forgot`, users.forgotPassword));
  app.use(route.post(`${BASE}/users/register`, users.register));
  app.use(route.post(`${BASE}/users/login`, users.login));
  app.use(route.post(`${BASE}/users/verify`, users.verifyToken));

  // Experiments
  app.use(route.get(`${BASE}/experiments`, experiments.findAll));
  app.use(route.get(`${BASE}/experiments/:id`, experiments.findById));
  app.use(route.get(`${BASE}/experiments/completed`, experiments.findCompleted));
  app.use(route.get(`${BASE}/experiments/available`, experiments.findWithAvailableSpots));

  // Protected Routes

  // Check for a valid JWT in header
  app.use(convert(jwt({ secret: config.secret, passthrough: true })));

  // Users
  app.use(route.post(`${BASE}/users/password/reset`, users.resetPassword));

  // Experiments
  app.use(route.post(`${BASE}/experiments/add`, experiments.addExperiment));
  app.use(route.del(`${BASE}/experiments/:id/remove`, experiments.removeExperiment));
  app.use(route.post(`${BASE}/experiments/:id/compounds/add`, experiments.addCompound));
}
