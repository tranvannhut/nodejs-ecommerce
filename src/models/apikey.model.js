'use strict';

const { model, Schema, Type } = require('mongoose');

const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'apikeys';

// Declare the schema of the Mongo model
const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      enum: ['001', '002', '003'],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

// export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
