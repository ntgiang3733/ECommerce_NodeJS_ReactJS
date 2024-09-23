'use strict'
const AccessService = require('../services/access.service');
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {

    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res);
    }

    signup = async (req, res, next) => {
        new CREATED({
            message: 'Register ok',
            metadata: await AccessService.signup(req.body),
            options: {
                limit: 10
            }
        }).send(res);
    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout success',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res);
    }
}

module.exports = new AccessController(); 