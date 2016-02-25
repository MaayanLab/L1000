import mongoose, { Schema } from 'mongoose';

const compoundSchema = new Schema({
  submitter: {
    type: Schema.Types.ObjectId,
    index: { required: true },
    ref: 'User',
  },
  name: {
    type: String,
    index: { required: true },
  },
  description: String,
});

export default mongoose.model('Compound', compoundSchema, 'compounds');
