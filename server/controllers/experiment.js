import monk from 'monk';
import _debug from 'debug';
import config from '../serverConf';
import filter from 'lodash/collection/filter';

const debug = _debug('app:server:controllers:experiment');
const db = monk(config.dbUrl);
const Compounds = db.get('compounds');
const Experiments = db.get('experiments');
Compounds.drop();
Experiments.drop();

Compounds.insert({
  name: 'Michael McDermott',
  address: 'One Park Avenue, New York, NY',
  compound: 'Compound One',
  status: 'reserved',
}, (coErr, compoundOne) => {
  Experiments.insert({
    title: 'Experiment 1',
    type: 'Single Dose',
    description: 'Description of Experiment 1. Description of Experiment 1. ' +
      'Description of Experiment 1.',
    compounds: [compoundOne._id],
  });
  Experiments.insert({
    title: 'Experiment 2',
    type: 'Dose Response',
    description: 'Description of Experiment 2. Description of Experiment 2. ' +
      'Description of Experiment 2.',
    compounds: [compoundOne._id],
  });
});

Experiments.index('title', { unique: true });
// Compounds = wrap(Compounds);
// Experiments = wrap(Experiments);

export async function findAll(next) {
  if (this.method !== 'GET') {
    return await next;
  }
  const experiments = await Experiments.find({});
  const populatedExperiments = [];
  let index = 0;
  while (index < experiments.length) {
    const experiment = experiments[index];
    // Compounds are currently an array of ids. Find them and replace them with actual compounds
    experiment.compounds = await Compounds.find({ _id: { '$in': experiment.compounds } });
    populatedExperiments.push(experiment);
    index++;
  }
  this.body = populatedExperiments;
}

export async function findById(id, next) {
  if (this.method !== 'GET') {
    return await next;
  }
  this.body = await Experiments.findById(id);
}

export async function findWithAvailableSpots(next) {
  if (this.method !== 'GET') {
    return await next;
  }
  const experiments = await Experiments.find({});
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
}

export async function findCompleted(next) {
  if (this.method !== 'GET') {
    return await next;
  }
  const experiments = await Experiments.find({});
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
}

export async function addExperiment(next) {
  if (this.method !== 'POST') {
    return await next;
  }
  const newExperiment = await Experiments.insert(this.request.body);
  if (!newExperiment) {
    this.throw(400, 'Experiment could not be created.');
  }
  this.body = newExperiment;
}

export async function addCompound(id, next) {
  if (this.method !== 'POST') {
    return await next;
  }
  const experiment = await Experiments.findById(id);
  if (!experiment) {
    this.throw(404, 'Experiment not found.');
  }
  const isSingleDose = experiment.type === 'Single Dose';
  const numCompounds = isSingleDose ? 360 : 56;
  if (experiment.compounds && experiment.compounds.length === numCompounds) {
    this.throw(400, 'Experiment does not have any available spaces left.');
  }
  const newCompound = await Compounds.insert(this.request.body);
  if (!newCompound) {
    this.throw(400, 'Compound request invalid. Please check your request body.');
  }
  const compounds = experiment.compounds;
  compounds.push(newCompound);
  await Experiments.findAndModify({ _id: id }, { $set: { compounds } });
  this.body = await Experiments.findById(id);
}

export async function removeExperiment(id, next) {
  if (this.method !== 'DELETE') {
    return await next;
  }
  this.body = await Experiments.remove({ _id: id });
}
