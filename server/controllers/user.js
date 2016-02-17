/* eslint no-param-reassign:0 */
import monk from 'monk';
import _debug from 'debug';
import bcrypt from 'bcrypt';
import config from '../serverConf';
import { sign, verify } from 'koa-jwt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import omit from 'lodash/omit';

const debug = _debug('app:server:controllers:user');
const db = monk(config.dbUrl);
const Users = db.get('users');
Users.index('email', { unique: true });
const SALT_WORK_FACTOR = 10;

function createToken(user): String {
  return sign(user, config.secret, {
    expiresIn: 2 * 60 * 60, // 2 days
    issuer: 'http://amp.pharm.mssm.edu/L1000/',
  });
}

function checkToken(token): Promise {
  return new Promise((resolve, reject) => {
    verify(
      token,
      config.secret,
      { issuer: 'http://amp.pharm.mssm.edu/L1000/' },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
}

function hashPassword(password): Promise {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) {
        return reject(err);
      }
      // hash the password using our new salt
      bcrypt.hash(password, salt, (hashError, hash) => {
        if (hashError) {
          return reject(hashError);
        }
        resolve(hash);
      });
    });
  });
}

function comparePassword(hashedPass, passToCompare): Promise {
  return new Promise((resolve, reject) => {
    bcrypt.compare(passToCompare, hashedPass, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
}

export async function checkEmailAvailable(ctx) {
  if (ctx.method !== 'POST') {
    return;
  }
  const { email } = ctx.request.body;
  const userWithEmail = await Users.find({ email });
  if (userWithEmail) {
    ctx.throw(400, 'Email already exists');
  }
  ctx.body = 'Email available';
}

export async function register(ctx) {
  if (ctx.method !== 'POST') {
    return;
  }
  const userObj = ctx.request.body;
  const hashedPass = await hashPassword(userObj.password);
  userObj.password = hashedPass;

  const newUser = await Users.insert(userObj);
  if (!newUser) {
    ctx.throw(400, 'Could not sign up user. Please check your request body.');
  }
  const userWOPassword = omit(newUser, 'password');
  ctx.body = {
    token: createToken(userWOPassword),
    user: userWOPassword,
  };
}

export async function login(ctx) {
  if (ctx.method !== 'POST') {
    return;
  }
  const { email, password } = ctx.request.body;
  let user;
  try {
    user = await Users.findOne({ email });
    const passwordMatches = await comparePassword(user.password, password);
    if (!passwordMatches) {
      ctx.throw(401, 'Username/password incorrect. Please try again.');
    }
  } catch (e) {
    ctx.throw(401, 'Username/password incorrect. Please try again.');
  }
  const userWOPassword = omit(user, 'password');
  ctx.body = {
    token: createToken(userWOPassword),
    user: userWOPassword,
  };
}

export async function resetPassword(ctx) {
  if (ctx.method !== 'POST') {
    return;
  }

  const authHeader = ctx.request.headers.authorization;
  let userId;
  if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
    const token = authHeader.split(' ')[1];
    const user = checkToken(token);
    userId = user._id;
  }
  if (!userId) {
    ctx.throw(401, 'Token invalid. User Id not found.');
  }

  const { oldPassword, newPassword } = ctx.request.body;
  if (!oldPassword || !newPassword) {
    ctx.throw(400, 'Invalid response.');
  }
  const user = await Users.findOne({ _id: userId });
  if (!user) {
    ctx.throw(404, 'User with given id not found.');
  }
  // Compare "old password" to current password to make sure that they match.
  let passwordMatches;
  try {
    passwordMatches = await comparePassword(user.password, oldPassword);
  } catch (e) {
    ctx.throw(400, 'User Id/Password incorrect.');
  }

  if (!passwordMatches) {
    ctx.throw(400, 'User Id/Password incorrect.');
  }

  try {
    const password = await hashPassword(newPassword);
    await Users.updateById(userId, { password });
    ctx.body = 'Password updated successfully.';
  } catch (e) {
    debug(e);
    ctx.throw(500, 'An error occurred saving the new password.');
  }
}

export async function getUserFromResetToken(ctx, resetToken) {
  if (ctx.method !== 'GET') {
    return;
  }
  const user = await Users.findOne({
    resetToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    ctx.throw(404, 'User not found or token may have expired.');
  }
  ctx.body = omit(user, 'password', '__v');
}

export async function forgotPassword(ctx) {
  if (ctx.method !== 'POST') {
    return;
  }

  const { email } = ctx.request.body;
  if (!email) {
    ctx.throw(400, 'Email required.');
  }

  const token = crypto.randomBytes(20).toString('hex');
  let user;
  try {
    user = await Users.update({ email }, {
      resetToken: token,
      resetPasswordExpires: Date.now() + 60 * 60, // Token expires in one hour.
    });
  } catch (e) {
    debug(e);
    ctx.throw(500, 'An error occurred resetting password. Try again later.');
  }
  if (!user) {
    ctx.throw(404, 'User with email given was not found.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'maayanlabapps@gmail.com',
      pass: 'systemsbiology',
    },
  });
  const mailOpts = {
    to: user.email,
    from: 'password-reset@amp.pharm.mssm.edu',
    subject: 'L1000 Ordering System Password Reset',
    text: 'You are receiving this because you (or someone else) have requested ' +
      'the reset of the password for your L1000 Ordering System account.\n\n' +
      'Please click on the following link, or paste this into your browser to ' +
      `complete the reset process:\n\n${ctx.request.origin}/L1000/user/reset/${token}\n\n` +
      'If you did not request this, please ignore this email and your password ' +
      'will remain unchanged.\n',
  };
  transporter.sendMail(mailOpts, (err) => {
    if (err) {
      ctx.throw(500, 'An error occurred sending reset email.');
    } else {
      ctx.body = 'Email sent.';
    }
  });
}

export async function verifyToken(ctx) {
  if (ctx.method !== 'POST') {
    return;
  }
  const { token } = ctx.request.body;
  if (!token) {
    ctx.throw(400, 'No token sent to verify.');
  }
  try {
    await checkToken(token);
  } catch (e) {
    ctx.throw(403, 'Token is invalid or has expired.');
  }
  ctx.body = 'Token is valid.';
}
