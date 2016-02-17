import bcrypt from 'bcrypt';
import { sign, verify } from 'koa-jwt';
const SALT_WORK_FACTOR = 10;

import config from '../serverConf';

export function createToken(user): String {
  return sign(user, config.secret, {
    expiresIn: 2 * 60 * 60, // 2 days
    issuer: 'http://amp.pharm.mssm.edu/L1000/',
  });
}

export function checkToken(token): Promise {
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

export function hashPassword(password): Promise {
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

export function comparePassword(hashedPass, passToCompare): Promise {
  return new Promise((resolve, reject) => {
    bcrypt.compare(passToCompare, hashedPass, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
}

export function getUserFromHeader(ctx) {
  return new Promise((resolve, reject) => {
    const authHeader = ctx.request.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      const token = authHeader.split(' ')[1];
      checkToken(token)
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    } else {
      const errorText = 'Authorization header not sent with request or token is invalid.';
      ctx.throw(401, errorText);
      reject(new Error(errorText));
    }
  });
}
