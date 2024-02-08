'use strict';
const { Schema, model } = require('mongoose');
const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';
const discountSchema = new Schema(
  {
    discountName: { type: String, required: true },
    discountDescription: { type: String, required: true },
    discountType: { type: String, required: 'fixed_amount' }, // percentage
    discountValue: { type: Number, required: true }, // fixed_amount => 10.000 or percentage => 10%
    discountCode: { type: String, required: true }, //XNSJJ
    discountStartDate: { type: Date, required: true }, // start date discount
    discountEndDate: { type: Date, required: true }, // end date discount
    discountMaxUses: { type: Number, required: true }, // total amount discount apply for use
    discountUsesCount: { type: Number, required: true }, // amount discount used
    discountUsersUsed: { type: Array, default: [] }, // amount user used discount
    discountMaxUsesPerUser: { type: Number, required: true }, // amount allow user use discount
    discountMinOrderValue: { type: Number, required: true },
    discountShopId: { type: Schema.Types.ObjectId, ref: 'Shop' },

    discountIsActive: { type: Boolean, required: true },
    discountAppliesTo: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    discountProductIds: {
      type: Array,
      default: [],
    }, // amount product apply when discount apply to = 'specific',
    /*  // optionals
    discountProductCategory: { type: String }, // discount apply for category product
    discountApplyForArea: { type: String }, // discount for area
    discountCombineWith: { type: Boolean, default: false }, // discount combine with another discount
    discountLevel: { type: Number }, // discount based order accumulate ( if bill order increase => discount increate and otherwise)
    // discount push notification when discount expired and tracking log discount to improving campaign */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);
module.exports = model(DOCUMENT_NAME, discountSchema);
