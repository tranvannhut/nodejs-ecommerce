'use strict';
const express = require('express');
const accessController = require('../../controllers/access.controller');
const shopController = require('../../controllers/shop.controller');
const router = express.Router();
/**
 * @swagger
 * /api/endpoint:
 *   post:
 *     description: Create a new resource
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Resource created successfully
 */
router.get('/api/endpoint', (req, res) => {
  // Your route logic goes here
  res.status(201).send('Resource created successfully');
});
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));
router.post(
  '/shop/refreshToken',
  asyncHandler(accessController.handleRefreshToken),
);
// router.get("/hello", (req, res, next) => {
//   return res.status(200).json({
//     message: `Welcome to page Access{signUp, signIn}`,
//   });
// });

// authentication
router.use(asyncHandler(authentication));

router.post('/shop/logout', asyncHandler(accessController.logout));

router.get('/shop/demo', asyncHandler(shopController.demo));
module.exports = router;
