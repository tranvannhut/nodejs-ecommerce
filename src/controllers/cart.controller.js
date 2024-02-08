'use strict';
const { SuccessResponse } = require('../core/success.response');
const CartService = require('../services/cart/cart.service');

class CartController {
  /**
   * add product to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url /v1/api/cart/user
   * @return {}
   */
  addToCart = async (req, res, next) => {
    // new
    new SuccessResponse({
      message: 'Create new product in cart',
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };
  // update
  updateToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update new product in cart',
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };
  // delete
  deleteToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete new product in cart',
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };
  // select
  getListUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list product in cart',
      metadata: await CartService.getListUserCart(req.body),
    }).send(res);
  };
}
module.exports = new CartController();
