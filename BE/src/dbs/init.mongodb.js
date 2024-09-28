'use strict';

const mongoose = require('mongoose');
const { db: { host, name, port } } = require('../configs/config.mongodb');
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {

        if (true) {
            mongoose.set('debug', true);
            mongoose.set('debug', {
                color: true
            });
        }

        mongoose.connect(connectString).then(_ => console.log('Connect Mongodb success'))
            .catch(err => console.error('Error connect'));

    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;