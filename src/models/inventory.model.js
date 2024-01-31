'use strict';

const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'inventories';
// declare the Schema of the Mongo model
const inventorySchema = new Schema(
  {
    inventoryProductId: { type: Schema.Types.ObjectId, ref: 'Product' },
    inventoryLocation: { type: String, default: 'unknow' },
    inventoryStock: { type: Number, required: true },
    inventoryShopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inventoryReservations: { type: Array, default: [] },
    /**
     * cartId,
     * stock:1, // amount buy
     * createOn
     */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);
// export the model
module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema),
};
