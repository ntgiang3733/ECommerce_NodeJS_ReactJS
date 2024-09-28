const express = require('express');
const app = express();

require('dotenv').config();
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');

// init middleware
app.use(morgan('dev'));// use for dev
// app.use(morgan('combine'));// use for product
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

// init db
require('./dbs/init.mongodb');

// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();


// init routes
app.use('/', require('./routes'));

// handle error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app;