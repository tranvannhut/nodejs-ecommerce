"use strict";
const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// 1. check api key
router.use(apiKey);

// 2. check permission
router.use(permission("001"));

router.use("/v1/api", require("./access"));

module.exports = router;
