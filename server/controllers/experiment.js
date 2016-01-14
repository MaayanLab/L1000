import monk from 'monk';
import _debug from 'debug';
import config from '../../config';
import wrap from 'co-monk';
import filter from 'lodash/collection/filter';

const debug = _debug('app:server:controllers:experiment');
const db = monk(config.dbUrl);
let Compounds = db.get('compounds');
let Experiments = db.get('experiments');
Compounds.drop();
Experiments.drop();

Compounds.insert({ name: 'CompoundOne' }, (coErr, compoundOne) => {
  Compounds.insert({ name: 'CompoundTwo' }, (ctErr, compoundTwo) => {
    Compounds.insert({ name: 'CompoundThree' }, (cthErr, compoundThree) => {
      Experiments.insert({
        title: 'Experiment 1',
        type: 'Single Dose',
        description: 'Description of Experiment 1. Description of Experiment 1. ' +
          'Description of Experiment 1.',
        compounds: [compoundOne._id, compoundTwo._id, compoundThree._id],
      });
      Experiments.insert({
        title: 'Experiment 2',
        type: 'Dose Response',
        description: 'Description of Experiment 2. Description of Experiment 2. ' +
          'Description of Experiment 2.',
        compounds: [compoundOne._id, compoundTwo._id],
      });
    });
  });
});

Experiments.index('title', { unique: true });
Compounds = wrap(db.get('compounds'));
Experiments = wrap(db.get('experiments'));

exports.findAll = function *findAll(next) {
  if (this.method !== 'GET') {
    return yield next;
  }
  const experiments = yield Experiments.find({});
  const populatedExperiments = [];
  let index = 0;
  while (index < experiments.length) {
    const experiment = experiments[index];
    // Compounds are currently an array of ids. Find them and replace them with actual compounds
    experiment.compounds = yield Compounds.find({ _id: { '$in': experiment.compounds } });
    populatedExperiments.push(experiment);
    index++;
  }
  this.body = populatedExperiments;
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

exports.addExperiment = function *addExperiment(next) {
  if (this.method !== 'POST') {
    return yield next;
  }
  const newExperiment = yield Experiments.insert(this.request.body);
  if (!newExperiment) {
    this.throw(400, 'Experiment could not be created.');
  }
  this.body = newExperiment;
};

exports.addCompound = function *addCompound(id, next) {
  if (this.method !== 'POST') {
    return yield next;
  }
  const experiment = yield Experiments.findById(id);
  if (!experiment) {
    this.throw(404, 'Experiment not found.');
  }
  const isSingleDose = experiment.type === 'Single Dose';
  const numCompounds = isSingleDose ? 360 : 56;
  if (experiment.compounds && experiment.compounds.length === numCompounds) {
    this.throw(400, 'Experiment does not have any available spaces left.');
  }
  const newCompound = yield Compounds.insert(this.request.body);
  if (!newCompound) {
    this.throw(400, 'Compound request invalid. Please check your request body.');
  }
  const compounds = experiment.compounds;
  const index = this.request.query.index;
  // If index specified, add it there, otherwise, add to first available spot
  if (this.request.query && this.request.query.index && this.request.query.index < numCompounds) {
    compounds[index] = newCompound;
  } else {
    // Add newCompound to first available spot in compounds array
    for (let i = 0; i < numCompounds; i++) {
      if (!compounds[i]) {
        compounds[i] = newCompound;
        break;
      }
    }
  }
  yield Experiments.findAndModify({ _id: id }, { $set: { compounds } });
  this.body = yield Experiments.findById(id);
};

exports.removeExperiment = function *removeExperiment(id, next) {
  if (this.method !== 'DELETE') {
    return yield next;
  }
  this.body = yield Experiments.remove({ _id: id });
};
