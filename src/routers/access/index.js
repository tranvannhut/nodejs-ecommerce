"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));
// router.get("/hello", (req, res, next) => {
//   return res.status(200).json({
//     message: `Welcome to page Access{signUp, signIn}`,
//   });
// });

// authentication
// router.use(asyncHandler(authentication));
console.log("hello");
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/refreshToken",
  asyncHandler(accessController.handleRefreshToken)
);
module.exports = router;
