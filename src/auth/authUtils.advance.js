"use strict";
const JWT = require("jsonwebtoken");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    // refresstoken
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    // JWT compare publicKey (after save DB ) with accessToken (contain privateKey)
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(err);
      } else {
        console.log("decode ::", decode);
      }
    });
    // return accessToken , refreshToken
    return { accessToken, refreshToken };
  } catch (error) {}
};

module.exports = {
  createTokenPair,
};
