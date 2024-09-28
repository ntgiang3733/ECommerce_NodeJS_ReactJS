'use strict'

const { SuccessResponse } = require('../core/success.response');
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new cart Success',
            metadata: await CartService.addToCart(req.body)
        }).send(res);
    }

    // update + -
    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new cart Success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res);
    }

    deleteUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete cart Success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res);
    }

    getListUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list cart Success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res);
    }

}

module.exports = new CartController();