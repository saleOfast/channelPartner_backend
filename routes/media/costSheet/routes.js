//importing modules
const express = require("express");
const router = express.Router();
const app = express()

const clientCostSheet = require('./clientCostSheet')
const vendorCostSheet = require('./vendorCostSheet')

//Campaign routes
app.use('/clientCostSheet', clientCostSheet)
app.use('/vendorCostSheet', vendorCostSheet)

module.exports = app;