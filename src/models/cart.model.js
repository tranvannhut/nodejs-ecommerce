'use strict';

const { Schema, model } = require('mongoose');
const COLLECTION_NAME = 'carts';
const DOCUMENT_NAME = 'Cart';
const cartSchema = new Schema(
  {
    cartStatus: {
      type: String,
      required: true,
      enum: ['active', 'completed', 'pendding', 'failed'],
    },
    // cartUserId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Shop',
    //   required: true,
    // },
    /**
     * cartProducts
     * [
     *   {
     *      productId, quantity , shopId, price , name
     *   }
     * ]
     */
    cartProducts: {
      type: Array,
      required: true,
      default: [],
    },
    cartCountProduct: {
      type: Number,
      default: 0,
    },
    cartUserId: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timeseries: {
      // == timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);
module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema),
};
