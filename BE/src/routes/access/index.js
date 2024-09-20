'use strict'

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();

// signup
router.post('/shop/signup', accessController.signup);

module.exports = router;