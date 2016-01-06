import monk from 'monk';
import _debug from 'debug';
import config from '../../config';
import wrap from 'co-monk';

const debug = _debug('app:server:controllers:experiment');
const db = monk(config.dbUrl);
const Experiment = wrap(db.get('experiments'));

exports.findAll = function *findAll(next) {
  debug('Finding all experiments');
  if (this.method !== 'GET') {
    return yield next;
  }
  this.body = yield Experiment.find({});
};

exports.findById = function *findById(id, next) {
  if (this.method !== 'GET') {
    return yield next;
  }
  this.body = yield Experiment.findById(id);
};
