"use strict";

const keyTokenModel = require("../../models/keytoken.model");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
class KeyTokenService {
  // save publicKey
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      /*     
      // level 0
      // const publicKeyString = publicKey.toString();
       const tokens = await keyTokenModel.create({
        user: userId,
        publicKey,
        privateKey

      });
      return tokens ? publicKey : null; */
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    console.log("🚀 ~ KeyTokenService ~ findByUserId= ~ userId:", userId)
    return await keyTokenModel.findOne({ user: userId }).lean();
  };
  static deleteTokenById = async (id) => {
    return await keyTokenModel.deleteOne(id);
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };
  static deleteTokenKeyByUserId = async (userId) => {
    console.log(
      "🚀 ~ KeyTokenService ~ staticdeleteTokenKeyByUserId ~ userId:",
      userId
    );
    return await keyTokenModel.findOneAndDelete({
      user: userId,
    });
  };
}
module.exports = KeyTokenService;
