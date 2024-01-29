'use strict';

const _ = require('lodash');

const getIntoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((e) => [e, 1]));
};
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((e) => [e, 0]));
};
const removeObjectNullOrUndefined = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null || obj[k] == undefined) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjectParse = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParse(obj[k]);
      Object.keys(response).forEach((e) => {
        final[`${k}.${e}`] = response[e];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};
module.exports = {
  getIntoData,
  getSelectData,
  unGetSelectData,
  removeObjectNullOrUndefined,
  updateNestedObjectParse,
};
