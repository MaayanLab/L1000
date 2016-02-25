import mongoose, { Schema } from 'mongoose';

const experimentSchema = new Schema({
  title: {
    type: String,
    index: { required: true },
  },
  type: {
    type: String,
    index: { required: true },
  },
  description: String,
  compounds: [{ type: Schema.Types.ObjectId, ref: 'Compound' }],
});

export default mongoose.model('Experiment', experimentSchema, 'experiments');
