'use strict';

//

const { model, Schema } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';
// Declare the Schema of the Mongo model
var userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
