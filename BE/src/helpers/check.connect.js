'use strict';

const os = require('os');
const process = require('process');
const mongoose = require('mongoose');
const _SECONDS = 5000;

//
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections:: ${numConnections}`);
}

// check overload
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnections}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024}`);
        if (numConnections > maxConnections) {
            console.log(`Connection overload detected!`);
        }
    }, _SECONDS); // monitor every 5s
}

module.exports = {
    countConnect,
    checkOverload
}