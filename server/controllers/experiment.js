import monk from 'monk';
import _debug from 'debug';
import config from '../../config';
import wrap from 'co-monk';
import filter from 'lodash/collection/filter';

const debug = _debug('app:server:controllers:experiment');
const db = monk(config.dbUrl);
let Experiments = db.get('experiments');
// Experiments.drop();
// Experiments.insert({
//   title: 'Experiment 1',
//   type: 'Single Dose',
//   description: 'Description of Experiment 1. Description of Experiment 1. Description of Experiment 1.',
//   compounds: [{ name: 'Compound1' }, { name: 'Compound2' }, { name: 'Compound3' }],
// });
// Experiments.insert({
//   title: 'Experiment 2',
//   type: 'Dose Response',
//   description: 'Description of Experiment 2. Description of Experiment 2. Description of Experiment 2.',
//   compounds: [{ name: 'Compound1' }, { name: 'Compound2' }, { name: 'Compound3' }],
// });
Experiments = wrap(db.get('experiments'));

exports.findAll = function *findAll(next) {
  debug('Finding all experiments');
  if (this.method !== 'GET') {
    return yield next;
  }
  this.body = yield Experiments.find({});
};

exports.findById = function *findById(id, next) {
  if (this.method !== 'GET') {
    return yield next;
  }
  this.body = yield Experiments.findById(id);
};

exports.findWithAvailableSpots = function *findWithAvailableSpots(next) {
  if (this.method !== 'GET') {
    return yield next;
  }
  const experiments = yield Experiments.find({});
  // Remove experiments that do not have compound spots available
  // Single Dose experiments contain 360 available spots
  // Dose Response experiments contain 56 available spots
  this.body = filter(experiments, (experiment) => {
    if (experiment.type === 'Single Dose') {
      return experiment.compounds.length < 360;
    } else if (experiment.type === 'Dose Response') {
      return experiment.compounds.length < 56;
    }
    debug(`Experiment with title: ${experiment.title} does not have a type!`);
  });
};

exports.findCompleted = function *findCompleted(next) {
  if (this.method !== 'GET') {
    return yield next;
  }
  const experiments = yield Experiments.find({});
  // Remove experiments that have compound spots available
  // Single Dose experiments contain 360 available spots
  // Dose Response experiments contain 56 available spots
  this.body = filter(experiments, (experiment) => {
    if (experiment.type === 'Single Dose') {
      return experiment.compounds.length === 360;
    } else if (experiment.type === 'Dose Response') {
      return experiment.compounds.length === 56;
    }
    debug(`Experiment with title: ${experiment.title} does not have a type!`);
  });
};
