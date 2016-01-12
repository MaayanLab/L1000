import experiments from '../controllers/experiment';
import _debug from 'debug';
import route from 'koa-route';

const debug = _debug('app:server:routes');

const BASE = '/L1000/api/v1';

export default function routes(app) {
  debug('Requiring routes...');
  app.use(route.get(`${BASE}/experiments`, experiments.findAll));
  app.use(route.get(`${BASE}/experiments/available`, experiments.findWithAvailableSpots));
  app.use(route.get(`${BASE}/experiments/completed`, experiments.findCompleted));
  app.use(route.get(`${BASE}/experiments/:id`, experiments.findById));
}
