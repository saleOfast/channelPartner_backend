//importing modules
const express = require("express");
const router = express.Router();
const app = express()

const siteManagement = require('./siteManagementRoutes')
const mediaFormat = require('./mediaFormatRoutes')
const mediaVehicle = require('./mediaVehicleRoutes')
const mediaType = require('./mediaTypeRoutes')
const siteStatus = require('./siteStatusRoutes')
const rating = require('./ratingRoutes.js')
const availabiltyStatus = require('./availabiltyStatusRoutes.js')
const mountingCost = require('./mountingCostRoutes.js')
const printingMaterial = require('./printingMaterialRoutes.js')
const printingCost = require('./printingCostRoutes.js')
const campaign = require('./campaign/routes.js');
const CostSheet = require('./costSheet/routes.js');
const paymentStatus = require('./paymentStatusRoutes.js')
const conversionPercentage = require('./conversionPercentage.js')

const estimation = require('./estimationRoutes.js')
const estimationStatus = require('./estimationStatusRoutes.js')
const estimationAssetBusiness = require('./estimationForAssetRoutes.js')
const estimationAgencyBusiness = require('./sitesForAgencyBusinessEstimateRoutes.js')
const estimationType = require('./estimationTypeRoutes.js')

const purchaseOrder = require('./purchaseOrderRoutes.js')
const salesOrder = require('./salesOrderRoutes.js')

const jobCard = require('./jobCardsRoutes.js')
const ndpReason = require('./ndpReasonsRoutes.js')
const ndp = require('./ndpRoutes.js')

const dashboard = require('./dashboardRoutes.js')


//admin routes
app.use('/siteManagement', siteManagement)
app.use('/mediaFormat', mediaFormat)
app.use('/mediaVehicle', mediaVehicle)
app.use('/mediaType', mediaType)
app.use('/siteStatus', siteStatus)
app.use('/rating', rating)
app.use('/availabiltyStatus', availabiltyStatus)
app.use('/mountingCost', mountingCost)
app.use('/printingMaterial', printingMaterial)
app.use('/printingCost', printingCost)
app.use('/campaign', campaign)
app.use('/estimation', estimation)
app.use('/estimationStatus', estimationStatus)
app.use('/estimationAssetBusiness', estimationAssetBusiness)
app.use('/estimationAgencyBusiness', estimationAgencyBusiness)
app.use('/costSheet', CostSheet)
app.use('/purchaseOrder', purchaseOrder)
app.use('/salesOrder', salesOrder)
app.use('/conversionPercentage', conversionPercentage)
app.use('/paymentStatus', paymentStatus)
app.use('/jobCard', jobCard)
app.use('/ndpReason', ndpReason)
app.use('/ndp', ndp)
app.use('/estimationType', estimationType)
app.use('/dashboard', dashboard)


module.exports = app;