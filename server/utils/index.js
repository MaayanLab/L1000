import { sign, verify } from 'jsonwebtoken';

import config from '../serverConf';


export function createToken(user): String {
  return new Promise((resolve) => {
    // Mongoose objects are not true JS objects.
    // Call toObject() on user if the method exists to turn mongoose model to a pure object.
    const payload = !!user.toObject ? user.toObject() : user;
    sign(
      payload,
      config.secret,
      { expiresIn: '2 days', issuer: 'http://amp.pharm.mssm.edu/L1000/' },
      (token) => resolve(token)
    );
  });
}

export function checkToken(token): Promise {
  return new Promise((resolve, reject) => {
    verify(token, config.secret, { issuer: 'http://amp.pharm.mssm.edu/L1000/' },
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
