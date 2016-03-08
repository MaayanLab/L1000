import mongoose, { Schema } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';

const SALT_WORK_FACTOR = 10;

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
    required: true,
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  addressOne: {
    type: String,
    required: true,
  },
  addressTwo: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
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

function beforeSave(next) {
  const user = this;
  user.cart.subTotal = 0;
  user.cart.items.forEach((item) => user.cart.subTotal += item.price);
  user.cart.total = user.cart.subTotal + user.cart.shippingCost;

  // Only hash password if it's been modified
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }

    // hash the password using our new salt
    hash(user.password, salt, (hashError, hashedPass) => {
      if (hashError) {
        return next(hashError);
      }

      // override the clear-text password with the hashed one
      user.password = hashedPass;
      return next();
    });
  });
}

userSchema.pre('save', beforeSave);
userSchema.pre('findOneAndUpdate', beforeSave);

userSchema.methods.comparePassword = function comparePass(passToCompare): Promise {
  const user = this;
  return new Promise((resolve, reject) => {
    compare(passToCompare, user.password, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};


export default mongoose.model('User', userSchema, 'users');
