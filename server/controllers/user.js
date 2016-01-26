import monk from 'monk';
import _debug from 'debug';
import bcrypt from 'bcrypt';
import config from '../serverConf';
import { sign } from 'koa-jwt';
import omit from 'lodash/object/omit';

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

export async function register(next) {
  if (this.method !== 'POST') {
    return await next;
  }
  const userObj = this.request.body;
  const hashedPass = await hashPassword(userObj.password);
  userObj.password = hashedPass;

  const newUser = await Users.insert(userObj);
  if (!newUser) {
    this.throw(400, 'Could not sign up user. Please check your request body.');
  }
  const userWOPassword = omit(newUser, 'password');
  this.body = {
    token: createToken(userWOPassword),
    user: userWOPassword,
  };
}

export async function login(next) {
  if (this.method !== 'POST') {
    return await next;
  }
  const { email, password } = this.request.body;
  let user;
  try {
    user = await Users.findOne({ email });
    const passwordMatches = await comparePassword(user.password, password);
    if (!passwordMatches) {
      this.throw(401, 'Username/password incorrect. Please try again.');
    }
  } catch (e) {
    debug(e);
    this.throw(401, 'Username/password incorrect. Please try again.');
  }
  const userWOPassword = omit(user, 'password');
  this.body = {
    token: createToken(userWOPassword),
    user: userWOPassword,
  };
}
