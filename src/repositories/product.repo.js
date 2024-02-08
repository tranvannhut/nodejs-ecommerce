'use strict';
const { Types } = require('mongoose');
const {
  product,
  electronics,
  clothing,
  furniture,
} = require('../models/product.model');
const {
  getSelectData,
  unGetSelectData,
  convertToObjectIdMongo,
} = require('../utils');
const getAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const getAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const updatePublishProductByShop = async ({ productId, productShop }) => {
  const foundProduct = await product.findOne({
    productShop: new Types.ObjectId(productShop),
    _id: new Types.ObjectId(productId),
  });
  if (!foundProduct) return null;
  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { modifiedProduct } = await foundProduct.updateOne(foundProduct);
  return modifiedProduct;
};
const updateUnPublishProductByShop = async ({ productId, productShop }) => {
  const foundProduct = await product.findOne({
    productShop: new Types.ObjectId(productShop),
    _id: new Types.ObjectId(productId),
  });
  if (!foundProduct) return null;
  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  const { modifiedProduct } = await foundProduct.updateOne(foundProduct);
  return modifiedProduct;
};
const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await product
    .find(
      {
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: 'textScore' },
      },
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return result;
};
const findAllProduct = async ({ filter, sort, limit, page, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return products;
};
const findProductById = async ({ productId, unSelect }) => {
  return await product.findOne({ productId }).select(unGetSelectData(unSelect));
};
const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
};
const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('productShop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const getProductById = async (productId) => {
  return await product.findOne({ _id: convertToObjectIdMongo(productId) });
};
module.exports = {
  getAllDraftForShop,
  updatePublishProductByShop,
  getAllPublishedForShop,
  updateUnPublishProductByShop,
  searchProductsByUser,
  findAllProduct,
  findProductById,
  updateProductById,
  getProductById,
};
