import _debug from 'debug';
import route from 'koa-route';
import jwt from 'koa-jwt';
import experiments from '../controllers/experiment';
import users from '../controllers/user';
import config from '../serverConf';

const debug = _debug('app:server:routes');

const BASE = '/L1000/api/v1';

export default function routes(app) {
  debug('Requiring routes...');
  // Unprotected Routes

  // Users
  app.use(route.post(`${BASE}/register`, users.register));
  app.use(route.post(`${BASE}/login`, users.login));

  // Experiments
  app.use(route.get(`${BASE}/experiments`, experiments.findAll));
  app.use(route.get(`${BASE}/experiments/:id`, experiments.findById));
  app.use(route.get(`${BASE}/experiments/completed`, experiments.findCompleted));
  app.use(route.get(`${BASE}/experiments/available`, experiments.findWithAvailableSpots));

  // Protected Routes
  app.use(jwt({ secret: config.secret, passthrough: true }));
  app.use(route.post(`${BASE}/experiments/add`, experiments.addExperiment));
  app.use(route.del(`${BASE}/experiments/:id/remove`, experiments.removeExperiment));
  app.use(route.post(`${BASE}/experiments/:id/compounds/add`, experiments.addCompound));
}
