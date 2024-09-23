'use strict'

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    ForbiddenError
} = require('../core/error.response');

const { findByEmail } = require('./shop.service');
const { token } = require('morgan');
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {

    static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happend!! Pls relogin');
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered');

        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError('Shop not registered');


        const tokens = await createTokenPair(
            { userId, email },
            keyStore.publicKey,
            keyStore.privateKey
        );

        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        });

        return {
            user,
            tokens
        }
    }

    static handlerRefreshToken = async refreshToken => {

        // check xem token da duoc su dung chua?
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        if (foundToken) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            // xoa token trong keyStore
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happend!! Pls relogin');
        }

        const holderToken = await KeyTokenService.findByRefreshToken({ refreshToken });
        if (!holderToken) throw new AuthFailureError('Shop not registered');

        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError('Shop not registered');


        const tokens = await createTokenPair(
            { userId, email },
            holderToken.publicKey,
            holderToken.privateKey
        );

        await holderToken.updateOne({
            $set: {
                refreshToken: token.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        });

        return {
            user: { userId, email },
            tokens
        }

    }

    /*
        1. check email in dbs
        2. match password
        3. create accessToken-refreshToken and save
        4. generate tokens
        5. get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {

        // 1.
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new BadRequestError('Shop not registered');

        // 2.
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Authentication error');

        // 3.
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // 4.
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({
            userId,
            email
        }, publicKey, privateKey);


        await KeyTokenService.createKeyToken({
            userId,
            privateKey,
            publicKey,
            refreshToken: tokens.refreshToken
        })

        // 5. 
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        }


    }

    static signup = async ({ name, email, password }) => {
        try {
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                throw new BadRequestError('Error: Shop already registered');
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            });
            if (newShop) {
                // create privateKey, publicKey
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                });
                if (!keyStore) {
                    throw new BadRequestError('Error: keyStore error');
                }

                // create token pair
                const tokens = await createTokenPair({
                    userId: newShop._id,
                    email
                }, publicKey, privateKey);
                console.log('create token success: ', tokens);
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({
                            fields: ['_id', 'name', 'email'],
                            object: newShop
                        }),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        return delKey;
    }
}

module.exports = AccessService;