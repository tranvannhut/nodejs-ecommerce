'use strict';
/* // pattern Factory
const ProductService = require('../services/product.service');
const { SuccessResponse } = require('../core/success.response');
class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new product successful',
      metadata: await ProductService.createProduct(req.body.productType, {
        ...req.body,
        productShop: req.user.userId,
      }),
    }).send(res);
  };
} */

const ProductServiceAdvance = require('../services/product.service.advance');
const { SuccessResponse } = require('../core/success.response');
class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new product successful',
      metadata: await ProductServiceAdvance.createProduct(
        req.body.productType,
        {
          ...req.body,
          productShop: req.user.userId,
        },
      ),
    }).send(res);
  };
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update new product successful',
      metadata: await ProductServiceAdvance.updateProduct(
        req.body.productType,
        req.params.productId,
        {
          ...req.body,
          productShop: req.user.userId,
        },
      ),
    }).send(res);
  };
  /**
   * @description Get all draft product
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list draft product success',
      metadata: await ProductServiceAdvance.getAllDraftForShop({
        productShop: req.user.userId,
      }),
    }).send(res);
  };
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list draft product success',
      metadata: await ProductServiceAdvance.getAllPublishForShop({
        productShop: req.user.userId,
      }),
    }).send(res);
  };
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list product by user',
      metadata: await ProductServiceAdvance.getListProductByUser(req.params),
    }).send(res);
  };
  updatePublishProductForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update product success',
      metadata: await ProductServiceAdvance.updatePublishProduct({
        productId: req.params.productId,
        productShop: req.user.userId,
      }),
    }).send(res);
  };
  updateUnPublishProductForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update product success',
      metadata: await ProductServiceAdvance.updateUnPublishProduct({
        productId: req.params.productId,
        productShop: req.user.userId,
      }),
    }).send(res);
  };
  findAllProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all product success',
      metadata: await ProductServiceAdvance.findAllProduct(req.query),
    }).send(res);
  };
  findProductById = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all product success',
      metadata: await ProductServiceAdvance.findProductById({
        productId: req.params.productId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
