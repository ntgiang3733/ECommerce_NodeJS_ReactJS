
'use strict'
const express = require('express')
const cartController = require('../../controllers/cart.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils')

router.post('', asyncHandler(cartController.addToCart));
router.delete('', asyncHandler(cartController.deleteUserCart));
router.post('/update', asyncHandler(cartController.update));
router.get('', asyncHandler(cartController.getListUserCart));

module.exports = router;