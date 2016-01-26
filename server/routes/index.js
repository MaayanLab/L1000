import _debug from 'debug';
import route from 'koa-route';
import jwt from 'koa-jwt';
import convert from 'koa-convert';
import experiments from '../controllers/experiment';
import { register, login } from '../controllers/user';
import config from '../serverConf';

const debug = _debug('app:server:routes');

const BASE = '/L1000/api/v1';

export default function routes(app) {
  debug('Requiring routes...');
  // Unprotected Routes

  // Users
  app.use(route.post(`${BASE}/register`, register));
  app.use(route.post(`${BASE}/login`, login));

  // Experiments
  app.use(route.get(`${BASE}/experiments`, experiments.findAll));
  app.use(route.get(`${BASE}/experiments/:id`, experiments.findById));
  app.use(route.get(`${BASE}/experiments/completed`, experiments.findCompleted));
  app.use(route.get(`${BASE}/experiments/available`, experiments.findWithAvailableSpots));

  // Protected Routes

  // Check for a valid JWT in header
  app.use(convert(jwt({ secret: config.secret, passthrough: true })));

  // Experiments
  app.use(route.post(`${BASE}/experiments/add`, experiments.addExperiment));
  app.use(route.del(`${BASE}/experiments/:id/remove`, experiments.removeExperiment));
  app.use(route.post(`${BASE}/experiments/:id/compounds/add`, experiments.addCompound));
}
