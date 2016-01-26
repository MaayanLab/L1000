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

export default {
  findAll: async (ctx) => {
    if (ctx.method !== 'GET') {
      return;
    }
    const experiments = await Experiments.find({});
    const populatedExperiments = [];
    let index = 0;
    while (index < experiments.length) {
      const experiment = experiments[index];
      // Compounds are currently an array of ids.
      // Find them and replace them with actual compounds
      experiment.compounds = await Compounds.find({
        _id: {
          '$in': experiment.compounds,
        },
      });
      populatedExperiments.push(experiment);
      index++;
    }
    ctx.body = populatedExperiments;
  },
  findById: async (ctx, id) => {
    if (ctx.method !== 'GET') {
      return;
    }
    ctx.body = await Experiments.findById(id);
  },
  findWithAvailableSpots: async (ctx) => {
    if (ctx.method !== 'GET') {
      return;
    }
    const experiments = await Experiments.find({});
    // Remove experiments that do not have compound spots available
    // Single Dose experiments contain 360 available spots
    // Dose Response experiments contain 56 available spots
    ctx.body = filter(experiments, (experiment) => {
      if (experiment.type === 'Single Dose') {
        return experiment.compounds.length < 360;
      } else if (experiment.type === 'Dose Response') {
        return experiment.compounds.length < 56;
      }
      debug(`Experiment with title: ${experiment.title} does not have a type!`);
    });
  },
  findCompleted: async (ctx) => {
    if (ctx.method !== 'GET') {
      return;
    }
    const experiments = await Experiments.find({});
    // Remove experiments that have compound spots available
    // Single Dose experiments contain 360 available spots
    // Dose Response experiments contain 56 available spots
    ctx.body = filter(experiments, (experiment) => {
      if (experiment.type === 'Single Dose') {
        return experiment.compounds.length === 360;
      } else if (experiment.type === 'Dose Response') {
        return experiment.compounds.length === 56;
      }
      debug(`Experiment with title: ${experiment.title} does not have a type!`);
    });
  },
  addExperiment: async (ctx) => {
    if (ctx.method !== 'POST') {
      return;
    }
    const newExperiment = await Experiments.insert(ctx.request.body);
    if (!newExperiment) {
      ctx.throw(400, 'Experiment could not be created.');
    }
    ctx.body = newExperiment;
  },
  addCompound: async (ctx, id) => {
    if (ctx.method !== 'POST') {
      return;
    }
    const experiment = await Experiments.findById(id);
    if (!experiment) {
      ctx.throw(404, 'Experiment not found.');
    }
    const isSingleDose = experiment.type === 'Single Dose';
    const numCompounds = isSingleDose ? 360 : 56;
    if (experiment.compounds && experiment.compounds.length === numCompounds) {
      ctx.throw(400, 'Experiment does not have any available spaces left.');
    }
    const newCompound = await Compounds.insert(ctx.request.body);
    if (!newCompound) {
      ctx.throw(400, 'Compound request invalid. Please check your request body.');
    }
    const compounds = experiment.compounds;
    compounds.push(newCompound);
    await Experiments.findAndModify({ _id: id }, { $set: { compounds } });
    ctx.body = await Experiments.findById(id);
  },
  removeExperiment: async (ctx, id) => {
    if (ctx.method !== 'DELETE') {
      return;
    }
    ctx.body = await Experiments.remove({ _id: id });
  },
};
