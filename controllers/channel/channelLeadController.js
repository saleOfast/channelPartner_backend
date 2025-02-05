const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require('../../helper/responce')
const axios = require('axios');
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const sendEmail = require("../../common/mailer");


const zeroPad = (num, places) => String(num).padStart(places, '0');

function getCurrentWeekStartDate() {
    let now = new Date();
    let dayOfWeek = now.getDay(); // 0 (monday) to 6 (Sunday)
    let diff = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    let startDate = new Date(now);
    startDate.setDate(startDate.getDate() + diff);
    return startDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
}

function getCurrentWeekEndDate() {
    let now = new Date();
    let dayOfWeek = now.getDay(); // 0 (monday) to 6 (Sunday)
    let diff = (dayOfWeek === 0 ? 0 : 7) - dayOfWeek;
    let endDate = new Date(now);
    endDate.setDate(endDate.getDate() + diff);
    return endDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
}

exports.storeChannelLead = async (req, res) => {
    try {
        // Destructuring request body
        let { lead_name, email_id, p_contact_no, address, pincode, p_visit_date, p_visit_time, project_id, project_name, created_on, updated_on } = req.body;
        let leadData;

        if (!p_contact_no || p_contact_no == "" || Number(p_contact_no) == NaN) {
            p_contact_no = null
        }

        // Check for duplicate lead based on email, contact number, visit date, and visit time
        leadData = await req.config.leads.findOne({
            where: {
                sales_project_id: project_id,
                [Op.or]: [
                    { email_id: email_id }, { p_contact_no: p_contact_no }
                ]
            }
        });

        // If duplicate lead found, return an error response
        if (leadData) {
            return await responseError(req, res, "Lead already exists with this email or phone.");
        }

        // Count the total number of leads (including soft-deleted ones)
        let leadcount = await req.config.leads.count({ paranoid: false });

        // Prepare lead data for insertion
        let body = {
            lead_name,
            email_id,
            p_contact_no,
            address,
            pincode,
            p_visit_date,
            p_visit_time,
            assigned_by: req.user.user_id,
            assigned_lead: req.user.user_id,
            lead_owner: req.user.user_id,
            sales_project_id: project_id,
            sales_project_name: project_name,
            lead_stg_id: 1,
            created_on,
            updated_on,
            lead_code: `${req.admin.user.charAt(0).toUpperCase()}${req.admin.user_l_name ? req.admin.user_l_name.charAt(0).toUpperCase() : ''}L_${zeroPad(leadcount + 1, 5)}`
        };

        leadData = await req.config.leads.create(body)
        return await responseSuccess(req, res, "Lead created successfully", leadData);

        // const fetchAccessToken = async (retries = 3) => {
        //     const fetch = (await import('node-fetch')).default;
        //     const url = `${req.admin.host_name || process.env.CLIENT_TOKEN_URL}`;
        //     const params = new URLSearchParams({
        //         grant_type: req.admin.grant_type || process.env.GRANTTYPE,
        //         client_id: req.admin.salesforce_client_id || process.env.SALESFORCE_CLIENT_ID,
        //         client_secret: req.admin.salesforce_client_pwd || process.env.SALESFORCE_CLIENT_PWD
        //     });

        //     const requestOptions = {
        //         method: "POST",
        //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
        //         body: params.toString(),
        //         redirect: "follow"
        //     };

        //     for (let attempt = 1; attempt <= retries; attempt++) {
        //         try {
        //             const response = await fetch(url, requestOptions);
        //             if (!response.ok) {
        //                 throw new Error(`HTTP error! Status: ${response.status}`);
        //             }
        //             return await response.json(); // Assuming the response is JSON
        //         } catch (error) {
        //             logErrorToFile(error)
        //             if (attempt < retries) {
        //                 console.log(`Retry attempt ${attempt} failed. Retrying...`);
        //                 await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        //             } else {
        //                 throw error;
        //             }
        //         }
        //     }
        // };

        // const tokenResponse = await fetchAccessToken();
        // // Prepare lead data for Salesforce

        // if (tokenResponse && tokenResponse.access_token) {

        //     let salesforceData = JSON.stringify({
        //         "Clead_Full_Name__c": lead_name,
        //         "Cell_Phone__c": p_contact_no,
        //         "CP_User_Name__c": req.user.user,
        //         "Email__c": email_id,
        //         "Pin_Code__c": pincode,
        //         "Location__c": address,
        //         "Requirement_Type__c": "Residential",
        //         "Country_pklst__c": "India",
        //         "Registration_Type_pklst__c": "Phone Call",
        //         "Selected_Project_rltn__c": project_id,
        //         "Is_Created_By_Channel_Partner__c": "true"
        //     });

        //     // Configure Salesforce lead creation request
        //     let leadConfig = {
        //         method: 'post',
        //         maxBodyLength: Infinity,
        //         url: `${req.admin.salesforce_url || process.env.CLIENT_REQ_URL}/sobjects/Clead__c`,
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${tokenResponse.access_token}`,
        //         },
        //         data: salesforceData
        //     };

        //     // Create lead in Salesforce
        //     axios.request(leadConfig)
        //         .then((response) => {
        //             body.sales_lead_id = response.data.id;

        //             // Insert the lead data into the database
        //             req.config.leads.create(body).then(async (leadData) => {
        //                 return await responseSuccess(req, res, "Lead created successfully", leadData);
        //             }).catch((error) => {
        //                 console.error("Error creating lead:", error);
        //                 return responseError(req, res, "Something Went Wrong while creating the lead");
        //             });
        //         })
        // } else {
        //     return await responseError(req, res, "token genration failed", tokenResponse);
        // }

    } catch (error) {
        logErrorToFile(error)
        console.error("Error:", error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.getleads = async (req, res) => {
    try {
        let leadData;
        let whereClause = {};

        if (req.query.cp_id) {
            if (decodeURIComponent(req.query.cp_id)) {
                whereClause.lead_owner = decodeURIComponent(req.query.cp_id)
            }
        }
        if (req.query.status_id) {
            whereClause.lead_stg_id = req.query.status_id
        }
        if (req.query.f_date) {
            whereClause.createdAt = {
                [Op.gte]: req.query.f_date, // Greater than or equal to current date at midnight
                [Op.lt]: req.query.t_date// Less than current date + 1 day at midnight
            }
        } else {
            let weekStartDate = getCurrentWeekStartDate();
            let weekEndDate = getCurrentWeekEndDate();
            whereClause.createdAt = {
                [Op.gte]: weekStartDate, // Greater than or equal to current date at midnight
                [Op.lt]: weekEndDate// Less than current date + 1 day at midnight
            }
        }
        if (req.user.role_id !== null && req.user.role_id !== 3 && req.user.role_id !== 2) {
            whereClause.assigned_lead = req.user.user_id
        }
        if (!req.query.lead_id) {
            if (req.user.role_id === 2) {
                leadData = await req.config.leads.findAll({
                    where: {...whereClause},
                    include: [
                        {
                            model: req.config.leadStages,
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "deletedAt"],
                            },
                        },
                        {
                            model: req.config.users,
                            where: {
                                report_to: req.user.user_id
                            },
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "deletedAt"],
                            },
                            required: true
                        },
                        {
                            model: req.config.users, paranoid: false,
                            as: 'leadOwner',
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "deletedAt"],
                            },
                            required: true
                        },
                        {
                            model: req.config.leadVisit,
                            as: 'visitList',
                            attributes: {
                                exclude: ["updatedAt", "deletedAt"],
                            },
                            order: [["visit_id", "DESC"]],
                            limit: 1
                        },

                    ],
                    order: [["lead_id", "DESC"]],
                })
            }else if  (req.user.role_id === 3) {

                const getUserHierarchyQuery = `
                    WITH RECURSIVE user_hierarchy AS (
                        SELECT user_id, report_to, user
                        FROM db_users
                        WHERE user_id = :user_id
                        UNION
                        SELECT u.user_id, u.report_to, u.user
                        FROM db_users u
                        INNER JOIN user_hierarchy uh ON u.report_to = uh.user_id
                    )
                    SELECT user_id, user FROM user_hierarchy;
                `;

                // Fetch all users under the current BST Head
                const AllUsers = await req.config.sequelize.query(getUserHierarchyQuery, {
                    replacements: { user_id: req.user.user_id },
                    type: QueryTypes.SELECT
                });
                const userIds = AllUsers.map(user => user.user_id);

                leadData = await req.config.leads.findAll({
                    where: {
                        lead_owner: { [Op.in]: userIds } // Fetch leads assigned to all BST and channel partner users
                    },
                    include: [
                        {
                            model: req.config.leadStages,
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "deletedAt"],
                            },
                        },
                        {
                            model: req.config.users,
                            where: {
                                user_id: { [Op.in]: userIds }
                            },
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "deletedAt"],
                            },
                            required: true
                        },
                        {
                            model: req.config.users, paranoid: false,
                            as: 'leadOwner',
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "deletedAt"],
                            },
                            required: true
                        },
                        {
                            model: req.config.leadVisit,
                            as: 'visitList',
                            attributes: {
                                exclude: ["updatedAt", "deletedAt"],
                            },
                            order: [["visit_id", "DESC"]],
                            limit: 1
                        },

                    ],
                    order: [["lead_id", "DESC"]],
                })
            }else {
                leadData = await req.config.leads.findAll({
                    where: {
                        ...whereClause,
                    },
                    include: [
                        {
                            model: req.config.leadStages,
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "deletedAt"],
                            },
                        },
                        {
                            model: req.config.users, paranoid: false,
                            as: 'leadOwner',
                            attributes: {
                                exclude: ["createdAt", "updatedAt", "deletedAt"],
                            },
                            required: true
                        },
                        {
                            model: req.config.leadVisit,
                            as: 'visitList',
                            attributes: {
                                exclude: ["updatedAt", "deletedAt"],
                            },
                            order: [["visit_id", "DESC"]],
                            limit: 1
                        },

                    ],
                    order: [["lead_id", "DESC"]],
                })
            }

        } else {
            leadData = await req.config.leads.findByPk(req.query.lead_id, {
                include: [
                    {
                        model: req.config.channelProject,
                        as: 'projectData',
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "deletedAt"],
                        },
                    },
                    {
                        model: req.config.leadStages,
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "deletedAt"],
                        },
                    },
                    {
                        model: req.config.users,
                        as: 'leadOwner',
                        attributes: {
                            exclude: ["createdAt", "updatedAt", "deletedAt"],
                        },
                    },


                ]
            })
        }

        return await responseSuccess(req, res, "leadList list", leadData)

    } catch (error) {
        logErrorToFile(error)
        console.log("error", error)
        return await responseError(req, res, "leadList fetching failed")
    }
}

exports.editleads = async (req, res) => {
    try {

        let { lead_id, email_id, p_contact_no, p_visit_date, p_visit_time, project_id, project_name } = req.body
        let body = req.body

        if (!p_contact_no || p_contact_no == "" || Number(p_contact_no) == NaN) {
            p_contact_no = null
        }
        
        let leadData = await req.config.leads.findByPk(lead_id)
        if (!leadData) return await responseError(req, res, "no lead existed")

        let leadDuplicateData = await req.config.leads.findOne({
            where: {
                lead_id: { [Op.ne]: lead_id },
                [Op.or]: [
                    { email_id }, { p_contact_no }
                ]
            }
        })
        if (leadDuplicateData) return await responseError(req, res, "Lead already exists with this email or phone ")
        body.sales_project_id = project_id
        body.sales_project_name = project_name
        delete body.project_id

        await leadData.update(body)
        return await responseSuccess(req, res, "lead updated")

    } catch (error) {
        logErrorToFile(error)
        console.log("error", error)
        return await responseError(req, res, "lead updated failed")
    }
}

exports.deleteleads = async (req, res) => {
    try {

        let { lead_id } = req.body
        let leadData = await req.config.leads.findOne({
            where: {
                lead_id
            }
        })

        if (!leadData) return await responseError(req, res, "lead name does not existed")
        await leadData.destroy()
        return await responseSuccess(req, res, "lead deleted")

    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "lead deletion failed")
    }
}

exports.deleteLeadByID = async (req, res) => {
    try {
        const leadIds = req.body.l_id;

        if (!Array.isArray(leadIds) || leadIds.length === 0) {
            return responseError(req, res, "Leads not Selected");
        }

        const leadsToDelete = await req.config.leads.findAll({
            where: {
                lead_id: {
                    [Op.in]: leadIds,
                },
            },
        });

        if (leadsToDelete.length === 0) {
            return responseError(req, res, "No Leads found with the specified IDs");
        }

        await Promise.all(leadsToDelete.map((lead) => lead.destroy()));

        return responseSuccess(req, res, "Leads deleted successfully");
    } catch (error) {
        logErrorToFile(error);
        console.error("Error:", error);
        return responseError(req, res, "Something Went Wrong");
    }
};

exports.getSalesForceToken = async (req, res) => {
    try {

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://NK Realtors--postsales.sandbox.my.salesforce.com/services/oauth2/token?username=admin%40NK Realtors.com.postsales&password=NK Realtors%40123vYX98EkG31lg5Px0ZnL7htFFa&grant_type=password&client_id=3MVG9Po2PmyYruunGgi2prNyVV6tkMw2sEKnTxnl__qXGx8UtKhsi7cKL8WnfdaCyy9d7q5yB5slQkjvL3jvS&client_secret=11B5983495743D8DBA34CC3B5D12FAD8F0F11106ED19A7E00A01403F7942195E',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZGJfbmFtZSI6Ik1VTFRJX1VTRVI5ODk0MTA5NiIsInVzZXJfY29kZSI6IlVTRVI5ODk0MTA5NiIsImlhdCI6MTcxNTg0MjIzNiwiZXhwIjoxNzE1ODcxMDM2fQ.pZ3QE4XFrDT5ZCBkzP2_4Zzw09TIHJZoIJhO4tdRw5Y',
                'Cookie': 'BrowserId=uISrwxHlEe-g1NsuvW73ow; CookieConsentPolicy=0:0; LSKey-c$CookieConsentPolicy=0:0'
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                return responseSuccess(req, res, "response.data", response.data)
            })
            .catch((error) => {
                console.log(error);
                return responseError(req, res, "lead updated failed")
            });

    } catch (error) {
        logErrorToFile(error)
        return await responseError(req, res, "lead updated failed")
    }
}

exports.fetchOrderNO = async (req, res) => {
    try {
        const { queryStr } = req.body
        if (!queryStr) return await responseError(req, res, "empty string")
        var myWord = 'number';
        let result = new RegExp('\\b' + myWord + '\\b').test(queryStr);
        if (result) {
            let order = queryStr.toString().split('number: ')[1].split('Date')[0]
            return responseSuccess(req, res, "response.data", order.slice(0, order.length - 1))
        } else {
            return await responseError(req, res, "Order id doesnt exist ")
        }
        // false




    } catch (error) {
        logErrorToFile(error)
        console.log(error, "error")
        return await responseError(req, res, "Order got error")
    }
}

exports.getProjectList = async (req, res) => {
    try {
        const fetchAccessToken = async (retries = 3) => {
            const fetch = (await import('node-fetch')).default;
            const url = `${req.admin.host_name || process.env.CLIENT_TOKEN_URL}`;
            const params = new URLSearchParams({
                grant_type: req.admin.grant_type || process.env.GRANTTYPE,
                client_id: req.admin.salesforce_client_id || process.env.SALESFORCE_CLIENT_ID,
                client_secret: req.admin.salesforce_client_pwd || process.env.SALESFORCE_CLIENT_PWD
            });

            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString(),
                redirect: "follow"
            };

            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    const response = await fetch(url, requestOptions);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return await response.json(); // Assuming the response is JSON
                } catch (error) {
                    logErrorToFile(error)
                    if (attempt < retries) {
                        console.log(`Retry attempt ${attempt} failed. Retrying...`);
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
                    } else {
                        throw error;
                    }
                }
            }
        };

        const tokenResponse = await fetchAccessToken();

        const fetchProjectList = async (accessToken, retries = 3) => {
            const fetch = (await import('node-fetch')).default;
            const url = `${req.admin.salesforce_url || process.env.CLIENT_REQ_URL}/query?q=SELECT+Id,Project_Name__c+FROM+CProject__c`;
            const requestOptions = {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                redirect: "follow"
            };

            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    const response = await fetch(url, requestOptions);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return await response.json();
                } catch (error) {
                    logErrorToFile(error)
                    if (attempt < retries) {
                        console.log(`Retry attempt ${attempt} failed. Retrying...`);
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
                    } else {
                        throw error;
                    }
                }
            }
        };


        const accessToken = tokenResponse.access_token;

        const projectList = await fetchProjectList(accessToken);
        return responseSuccess(req, res, "project list", projectList);

    } catch (error) {
        logErrorToFile(error)
        console.error("Error fetching project list:", error);
        return await responseError(req, res, "project list fetch failed");
    }
};

// get lead list or one lead 
exports.getLeadLocationList = async (req, res) => {
    try {
        let leadLocation = await req.config.leadLocation.findAll()
        await responseSuccess(req, res, "lead location list", leadLocation)
    } catch (error) {
        logErrorToFile(error)
        console.log(error)
        await responseError(req, res, "Something Went Wrong")
    }
}

exports.sendMailToLeadOwners = async (req) => {
    try {
        const pendingLeads = await req.leads.findAll({
            where: {
                lead_stg_id: 1,
                deletedAt: null,
                mailSent: { [Op.in]: [null, false] },
                createdAt: {
                    [Op.lte]: moment().subtract(24, 'hours').toDate()
                }
            }
        });

        if (pendingLeads.length === 0) {
            console.log('No Leads found.');
            return;
        }
        const emailTemplate = await req.config.emailTemplates.findOne({ where: { template_id: 2 } })  // Pending Channel Partner Lead Notification (72 Hrs)
        const htmlTemplatePath = path.join(
            __dirname,
            "..",
            "..",
            "mail",
            "cp",
            "newCPLead.html"
        );
        const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8");
        for (const lead of pendingLeads) {
            let leadOwner = await req.users.findByPk(lead.lead_owner)
            if (!leadOwner) {
                console.log(`No lead owner for lead ${lead.lead_name}`)
                continue
            }
            let company_name
            let company = await req.config.organisationInfo.findOne({
                attributes: ['company_name']
            })
            if (company) {
                company_name = company.company_name || 'NK Realtors'
            }
            else {
                company_name = 'NK Realtors'
            }

            let htmlContent = htmlTemplate.replace("{{Name}}", lead.lead_name);
            htmlContent = htmlContent.replace("{{PhoneNo}}", lead.p_contact_no);
            htmlContent = htmlContent.replace("{{EmailID}}", lead.email_id).replace(/{{CompanyName}}/g, company_name);

            if (!leadOwner.email) {
                console.log(`No lead owner email found for lead ${lead.lead_name}`)
                continue
            }
            let option = {
                email: leadOwner.email,
                subject: "NK Realtors",
                message: htmlContent,
            };
            await sendEmail(option);
            await req.leads.update({ mailSent: true }, { where: { lead_id: lead.lead_id } })
        }
        console.log('Emails sent successfully.');
        return
    } catch (error) {
        console.error('Error assigning leads:', error);
    }
}