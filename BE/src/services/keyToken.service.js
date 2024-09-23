'use strict'

const { Types } = require('mongoose');
const keyTokenModel = require('../models/keytoken.model');

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0: 
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // });

            // return tokens ? tokens.publicKey : null

            // level 1:
            const filter = {
                user: userId
            };
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            };
            const options = {
                upsert: true,
                new: true
            };
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    }

    static removeKeyById = async id => {
        return await keyTokenModel.deleteOne(id);
    }
}

module.exports = KeyTokenService;