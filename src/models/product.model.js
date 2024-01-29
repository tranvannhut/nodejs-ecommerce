'use strict';
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
const slugify = require('slugify');
const productSchema = new Schema(
  {
    productName: { type: String, require: true },
    productThumb: { type: String, require: true },
    productDescription: { type: String },
    productPrice: { type: Number, require: true },
    productQuantity: { type: Number, require: true },
    productType: {
      type: String,
      require: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    productShop: { type: String, type: Schema.Types.ObjectId, ref: 'Shop' },
    productAttributes: { type: Schema.Types.Mixed, require: true },
    productSlug: String, // quan-jean-cap-cap
    productRatingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be less 5.0'],
      // 4.3433 => 4.3
      set: (val) => Math.round(val * 10) / 10,
    },
    productVariations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    // productAttributes: {
    //   type: Schema.Types.ObjectId,
    //   require: true,
    //   ref: "Clothing",
    // },
  },
  {
    timestamps: true,
    collections: COLLECTION_NAME,
  },
);
// create index for full-text search
productSchema.index({ productName: 'text', productDescription: 'text' });
// document middleware : run before
productSchema.pre('save', function (next) {
  this.productSlug = slugify(this.productName, { lowe: true });
  next();
});
// define the product type = clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'clothing',
    timestamps: true,
  },
);
// define the product type = electronic
const electronicSchema = new Schema(
  {
    manufacture: { type: String, require: true },
    model: String,
    color: String,
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'electronic',
    timestamps: true,
  },
);
// define the product type = furniture
const furnitureSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    productShop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'furniture',
    timestamps: true,
  },
);
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicSchema),
  clothing: model('Clothing', clothingSchema),
  furniture: model('Furniture', furnitureSchema),
};
