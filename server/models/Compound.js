import mongoose, { Schema } from 'mongoose';

const compoundSchema = new Schema({
  submitter: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  structure: { type: String, required: true },
  barcode: { type: String, required: true },
  name: { type: String, required: true },
  vendor: { type: String, required: true },
  vendorCatalogId: { type: String, required: true },
  vendorLotNum: { type: String, required: true },
  weight: { type: String, required: true },
  weightUnits: { type: String, required: true },
  conc: { type: String, required: true },
  concUnits: { type: String, required: true },
  volume: { type: String, required: true },
  volumeUnits: { type: String, required: true },
  solvent: { type: String, required: true },
  plate: { type: String, required: true },
  well: { type: String, required: true },
});

export default mongoose.model('Compound', compoundSchema, 'compounds');
