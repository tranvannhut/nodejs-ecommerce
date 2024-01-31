'use strict';
const express = require('express');
const discountController = require('../../controllers/discount.controller');

const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// router
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get(
  '/list_product_code',
  asyncHandler(discountController.getAllDiscountCodeWithProduct),
);
// authentication
router.use(asyncHandler(authentication));
router.post('/', asyncHandler(discountController.createDiscountCode));
router.get('/', asyncHandler(discountController.getAllDiscountCode));
module.exports = router;
