"use strict";

const apikeyModel = require("../../models/apikey.model");
const crypto = require("crypto")
const findApiKeyById = async (key) => {
  // const apiKeyNew = await apikeyModel.create({key : crypto.randomBytes(64).toString('hex'), permissions:['001','002']})
  const objKey = await apikeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = {
  findApiKeyById,
};
