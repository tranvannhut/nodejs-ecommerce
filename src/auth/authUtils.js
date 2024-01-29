'use strict';
const JWT = require('jsonwebtoken');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'x-access-token',
};

// service
const { findByUserId } = require('../services/key/keyToken.service');
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2 days', //"2 days", 2m
    });
    // refresstoken
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: '7 days', // "7 days", 10m
    });
    // JWT compare publicKey (after save DB ) with accessToken (contain privateKey)
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log('Error : ', err);
      } else {
        console.log('decode ::', decode);
      }
    });
    // return accessToken , refreshToken
    return { accessToken, refreshToken };
  } catch (error) {}
};
const authentication = async (req, res, next) => {
  /* 
   1 - Check userId missing???
   2 - Get AccessToken
   3 - VerifyToken
   4 - Check user in dbs?
   5 - Check keyStore with this userId
   6 - OK all => return next()
  */
  // 1.
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Invalid Request');

  // 2.
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not Found keyStore');

  // 3.
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError('Invalid Request');

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError('Invalid User');
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
};
const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
