'use strict'
const AccessService = require('../services/access.service');
const { OK, CREATED } = require('../core/success.response')

class AccessController {

    signup = async (req, res, next) => {
        new CREATED({
            message: 'Register ok',
            metadata: await AccessService.signup(req.body),
            options: {
                limit: 10
            }
        }).send(res);
    }
}

module.exports = new AccessController(); 