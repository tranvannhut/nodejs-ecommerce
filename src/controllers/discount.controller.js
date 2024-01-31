'use strict';
const { SuccessResponse } = require('../core/success.response');
const DiscountService = require('../services/discount/discount.service');

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Success code generate',
      metadata: await DiscountService.generateDiscount({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  getAllDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Success code found',
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Success code found',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };
  getAllDiscountCodeWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Success code found',
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
      }),
    }).send(res);
  };
}
module.exports = new DiscountController();
