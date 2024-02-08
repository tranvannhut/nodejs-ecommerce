'use strict';
const express = require('express');
const cartController = require('../../controllers/cart.controller');

const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// router
router.post('', cartController.addToCart);
router.delete('', cartController.deleteToCart);
router.post('/update', cartController.updateToCart);
router.get('', cartController.getListUserCart);
// authentication
router.use(asyncHandler(authentication));
module.exports = router;
