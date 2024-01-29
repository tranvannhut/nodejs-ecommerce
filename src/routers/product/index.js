'use strict';
const express = require('express');
const productController = require('../../controllers/product.controller');

const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
router.get(
  '/search/:keySearch',
  asyncHandler(productController.getListSearchProduct),
);
router.get('', asyncHandler(productController.findAllProduct));
router.get('/:productId', asyncHandler(productController.findProductById));
// authentication
router.use(asyncHandler(authentication));

router.post('', asyncHandler(productController.createProduct));
router.patch('/:productId', asyncHandler(productController.updateProduct));
router.put(
  '/published/:productId',
  asyncHandler(productController.updatePublishProductForShop),
);
router.put(
  '/unPublished/:productId',
  asyncHandler(productController.updateUnPublishProductForShop),
);

// query
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));
router.get(
  '/published/all',
  asyncHandler(productController.getAllPublishForShop),
);
module.exports = router;
