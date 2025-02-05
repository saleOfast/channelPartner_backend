//importing modules
const express = require("express");
const router = express.Router();
const app = express()

const campaignStatus = require('./campaignStatusRoutes')
const campaignProofRoutes = require('./campaignProofRoutes')
const campaignBusinessTypeRoutes = require('./campaignBusinessTypeRoutes')
const campaignManagementRoutes = require('./campaignManagementRoutes')

//Campaign routes
app.use('/campaignStatus', campaignStatus)
app.use('/campaignProof', campaignProofRoutes)
app.use('/campaignBusinessType', campaignBusinessTypeRoutes)
app.use('/campaignManagement', campaignManagementRoutes)

module.exports = app;