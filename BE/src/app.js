const express = require('express');
const app = express();

const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');

// init middleware
app.use(morgan('dev'));// use for dev
// app.use(morgan('combine'));// use for product
app.use(helmet());
app.use(compression());

// init db

// init routes

app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'hi'
    })
})

// handle error

module.exports = app;