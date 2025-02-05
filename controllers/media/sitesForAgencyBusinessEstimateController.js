const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../../helper/responce");
const csv = require('csv-parser');
const fs = require('fs');
const sharp = require('sharp')
const fileUpload = require("../../common/imageExport");
const path = require("path");

exports.addSitesForAgencyEstimates = async (req, res) => {
    try {
        const body = req.body.sites;
        let array = [];

        let file = "";

        if (req.files && req.files.file) {
            file = await fileUpload.csvUpload(req, res, "csv", "file");
            const results = [];
            const filePath = path.join(__dirname, '../../uploads/csv', `${file}`);
            console.log('Constructed filePath:', filePath);

            // Check if file exists before parsing
            // if (!fs.existsSync(filePath)) {
            //     return responseError(req, res, "CSV file not found");
            // }

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    results.push(row);
                    console.log(row)
                })
                .on('end', async () => {
                    console.log(results, 'results')
                    for (const site of results) {
                        let count = await req.config.sitesForAgencyEstimates.count({ paranoid: false });
                        let data = {
                            ...site,
                            site_code: `SI_AG_00${count + 1}`,
                            estimate_id: req.body.estimate_id,
                            start_date: req?.body?.start_date,
                            end_date: req?.body?.end_date,
                            duration: req?.body?.duration,
                            status: true
                        };
                        array.push(data);
                    }
                    let result = await req.config.sitesForAgencyEstimates.bulkCreate(array);
                    return await responseSuccess(req, res, "Agency Estimate Sites Created Successfully from CSV", result);
                })
                .on('error', (error) => {
                    logErrorToFile(error);
                    console.error("Error reading CSV file:", error);
                    return responseError(req, res, "Error reading CSV file");
                });
        } else if (body && Array.isArray(body)) {
            // If body is provided, process it as an array of objects
            let count = await req.config.sitesForAgencyEstimates.count({ paranoid: false });
            for (const site of body) {
                if (!site.height) {
                    return await responseError(req, res, "Please enter valid site Height.");
                }
                if (!site.quantity) {
                    return await responseError(req, res, "Please enter valid site quantity.");
                }
                if (!site.width) {
                    return await responseError(req, res, "Please enter valid site width.");
                }
                let siteCode = `SI_AG_${String(count + 1).padStart(3, '0')}`;
                let data = {
                    ...site,
                    site_code: siteCode,
                    start_date: body?.start_date,
                    end_date: body?.end_date,
                    duration: body?.duration,
                    status: true
                };
                array.push(data);
                count++;
            }
            let result = await req.config.sitesForAgencyEstimates.bulkCreate(array);
            return await responseSuccess(req, res, "Agency Estimate Sites Created Successfully", result);
        } else {
            return await responseError(req, res, "No valid input provided. Please provide either a CSV file or an array of objects in the body.");
        }
    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.getSitesForAgencyEstimates = async (req, res) => {
    try {
        const { estimate_id } = req.query
        let data = await req.config.sitesForAgencyEstimates.findAll({
            where: { estimate_id: estimate_id },
            include: [
                {
                    model: req.config.estimations, paranoid: false,
                    include: [
                        {
                            model: req.config.mediaCampaignManagement, paranoid: false,
                        }
                    ]
                }
            ]
        })

        return await responseSuccess(req, res, "Sites For Agency Business Fetched Succesfully", data)

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.updateSitesForAgencyEstimates = async (req, res) => {
    try {
        let data
        const { site_id, status } = req.body
        const body = req.body

        data = await req.config.sitesForAgencyEstimates.findOne({ where: { site_id: site_id } })
        if (!data) {
            return await responseError(req, res, "The Site ID does not exist")
        }
        if (status == true || status == false) {
            await data.update({ status: status })
            return await responseSuccess(req, res, status ? "Site Enabled Succesfully" : "Site Disabled Succesfully")
        } else {
            await data.update(body)
            return await responseSuccess(req, res, "Site Updated Succesfully")
        }

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteSitesForAgencyEstimates = async (req, res) => {
    try {
        let { site_id } = req.query
        let body = await req.config.sitesForAgencyEstimates.findOne({ where: { site_id: site_id } })
        if (!body) {
            return await responseError(req, res, "The Sites For Agency Business does not exist.")
        }
        await body.destroy()
        return await responseSuccess(req, res, "Sites For Agency Business Deleted Succesfully")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}
