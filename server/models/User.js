import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema({
  cartId: Number,
  compoundId: { type: Schema.Types.ObjectId, ref: 'Compound' },
  experimentId: { type: Schema.Types.ObjectId, ref: 'Experiment' },
  price: Number,
  quantity: Number,
});

const userSchema = new Schema({
  email: {
    type: String,
    index: { unique: true, required: true },
  },
  password: {
    type: String,
    index: { required: true },
  },
  cart: {
    items: [cartItemSchema],
    subTotal: Number,
    shippingMethod: String,
    shippingCost: Number,
    total: Number,
  },
  resetToken: String,
  resetPasswordExpires: Date,
});

export default mongoose.model('User', userSchema, 'users');
