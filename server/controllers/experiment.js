/* eslint no-param-reassign:0 */
import _debug from 'debug';
import filter from 'lodash/filter';
import Compound from '../models/Compound';
import Experiment from '../models/Experiment';

const debug = _debug('app:server:controllers:experiment');

// Compound.drop();
// Experiments.drop();
//
// Experiments.create({
//   title: 'Experiment 1',
//   type: 'Single Dose',
//   description: 'Description of Experiment 1. Description of Experiment 1. ' +
//     'Description of Experiment 1.',
//   compounds: [],
// });
// Experiments.create({
//   title: 'Experiment 2',
//   type: 'Dose Response',
//   description: 'Description of Experiment 2. Description of Experiment 2. ' +
//     'Description of Experiment 2.',
//   compounds: [],
// });

export async function findAll(ctx) {
  if (ctx.method !== 'GET') {
    ctx.throw(400, 'Bad Request');
  }
  ctx.body = await Experiment.find({}).populate('compounds').lean().exec();
}

export async function findById(ctx, id) {
  if (ctx.method !== 'GET') {
    ctx.throw(400, 'Bad Request');
  }
  ctx.body = await Experiment.findById(id).lean().exec();
}

export async function findWithAvailableSpots(ctx) {
  if (ctx.method !== 'GET') {
    ctx.throw(400, 'Bad Request');
  }
  const experiments = await Experiment.find({}).lean().exec();
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
}

export async function findCompleted(ctx) {
  if (ctx.method !== 'GET') {
    ctx.throw(400, 'Bad Request');
  }
  const experiments = await Experiment.find({}).lean().exec();
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
}

export async function addExperiment(ctx) {
  if (ctx.method !== 'POST') {
    ctx.throw(400, 'Bad Request');
  }
  const newExperiment = await Experiment.create(ctx.request.body);
  if (!newExperiment) {
    ctx.throw(400, 'Experiment could not be created.');
  }
  ctx.body = newExperiment;
}

export async function addCompound(ctx, id) {
  if (ctx.method !== 'POST') {
    ctx.throw(400, 'Bad Request');
  }
  const experiment = await Experiment.findById(id).exec();
  if (!experiment) {
    ctx.throw(404, 'Experiment not found.');
  }
  const isSingleDose = experiment.type === 'Single Dose';
  const numCompounds = isSingleDose ? 360 : 56;
  if (experiment.compounds && experiment.compounds.length >= numCompounds) {
    ctx.throw(400, 'Experiment does not have any available spaces left.');
  }
  const newCompound = await Compound.create(ctx.request.body);
  if (!newCompound) {
    ctx.throw(400, 'Compound request invalid. Please check your request body.');
  }
  const compounds = [...experiment.compounds, newCompound._id];
  ctx.body = await Experiment.findOneAndUpdate(
    { _id: id },
    { $set: { compounds } },
    { new: true },
  ).exec();
}

export async function removeCompound(ctx, experimentId, compoundId) {
  if (ctx.method !== 'POST') {
    ctx.throw(400, 'Bad Request');
  }
  const experiment = await Experiment.findById(experimentId).exec();
  if (!experiment) {
    ctx.throw(404, 'Experiment not found.');
  }
  const compounds = experiment.compounds.filter((compound) => compound._id !== compoundId);
  ctx.body = await Experiment.findOneAndUpdate(
    { _id: experimentId },
    { $set: { compounds } },
    { new: true },
  ).exec();
}

export async function removeExperiment(ctx, id) {
  if (ctx.method !== 'DELETE') {
    ctx.throw(400, 'Bad Request');
  }
  ctx.body = await Experiment.findByIdAndRemove(id).exec();
}
