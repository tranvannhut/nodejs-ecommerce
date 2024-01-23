"use strict";

const keyTokenModel = require("../../models/keytoken.model");

class KeyTokenService {
  // save publicKey
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      return tokens ? publicKey : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyTokenService;
