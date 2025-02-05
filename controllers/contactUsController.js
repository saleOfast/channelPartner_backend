const cron = require('node-cron');
const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const { responseError, responseSuccess } = require("../helper/responce");
const db = require("../model");
const sendEmail = require("../common/mailer");
const { date } = require("joi");
const path = require('path');
const fs = require('fs');

exports.addChannelPartnerLead = async (req, res) => {
    try {
        const { db_name, first_name, last_name, contact, email } = req.body;
        if (!db_name) return responseError(req, res, "Client Not Found");

        const stage = 'OPEN';
        const status = true;
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const createdAt = updatedAt = now;

        // Fetch admin details
        const admin = await db.clients.findOne({ where: { db_name, isDB: 1 } });
        if (!admin) return responseError(req, res, "Admin Not Found");

        const AdminMail = admin.email;

        // Check if the lead already exists
        const existingRecord = await db.sequelize.query(`
            SELECT 1 FROM ${db_name}.db_channel_partner_leads 
            WHERE email = :email OR contact = :contact
            LIMIT 1`, {
            replacements: { email, contact },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (existingRecord.length > 0) {
            return responseSuccess(req, res, "You Have Already Registered with Same Email or Mobile Number.");
        }

        // Fetch organization name
        const [orgRecord] = await db.sequelize.query(`
            SELECT company_name FROM ${db_name}.db_organisation_infos LIMIT 1`, {
            type: db.sequelize.QueryTypes.SELECT
        });
        const organisationName = orgRecord?.company_name || "NK Realtors";

        // Fetch or use default email template
        let [templateRecord] = await db.sequelize.query(`
            SELECT template FROM ${db_name}.db_email_templates WHERE template_id = 9 LIMIT 1`, {
            type: db.sequelize.QueryTypes.SELECT
        });

        if (!templateRecord) {
            const templatePath = path.join(__dirname, "..", "mail", "cp", "newCPLead.html");
            try {
                templateRecord = { template: fs.readFileSync(templatePath, "utf-8") };
            } catch (err) {
                templateRecord = { template: "Welcome to {{CompanyName}},\nThank you for showing interest in our channel partner programme." };
            }
        }

        // Customize the template
        let htmlContent = templateRecord.template
            .replace(/{{UsersName}}/g, `${first_name} ${last_name}`)
            .replace(/{{Name}}/g, `${first_name} ${last_name}`)
            .replace(/{{BDName}}/g, `${first_name} ${last_name}`)
            .replace(/{{PhoneNo}}/g, contact)
            .replace(/{{EmailID}}/g, email)
            .replace(/{{CompanyName}}/g, organisationName);

        // Send email
        const emailOptions = {
            email: AdminMail,
            subject: "New Channel Partner Lead",
            message: htmlContent,
        };
        await sendEmail(emailOptions);

        // Insert the new lead into the db_channel_partner_leads table
        const [newLead] = await db.sequelize.query(`
            INSERT INTO ${db_name}.db_channel_partner_leads 
            (first_name, last_name, contact, email, query, stage, status, createdAt, updatedAt)
            VALUES (:first_name, :last_name, :contact, :email, :query, :stage, :status, :createdAt, :updatedAt)`, {
            replacements: { first_name, last_name, contact, email, query: null, stage, status, createdAt, updatedAt },
            type: db.sequelize.QueryTypes.INSERT
        });

        // After inserting the lead, add a corresponding entry to db_channel_partner_lead_details
        const insertDetailsQuery = `
            INSERT INTO ${db_name}.db_channel_partner_lead_details 
            (cpl_id, stage, follow_up_date, remarks, status, createdAt, updatedAt)
            VALUES (:cpl_id, :stage, :follow_up_date, :remarks, :status, :createdAt, :updatedAt)`;

        await db.sequelize.query(insertDetailsQuery, {
            replacements: {
                cpl_id: newLead, // Use the newly created lead's ID
                stage: 'OPEN',
                follow_up_date: null, // Set follow-up date to null
                remarks: null, // Set remarks to null
                status: true,
                createdAt,
                updatedAt,
            },
            type: db.sequelize.QueryTypes.INSERT
        });

        return responseSuccess(req, res, "You Have Registered Successfully");

    } catch (error) {
        logErrorToFile(error);
        console.error("Error adding channel partner lead:", error);
        return responseError(req, res, "Something Went Wrong");
    }
};

exports.getChannelPartnerLeads = async (req, res) => {
    try {
        const { db_name, cpl_id, bst_id, f_date, t_date, status_id } = req.query;
        let leads;

        if (!db_name) {
            return await responseError(req, res, "Client Database Name is Required");
        }

        // Define date filters
        let dateFilter = '';
        if (f_date && t_date) {
            dateFilter = ` AND leads.createdAt BETWEEN :f_date AND :t_date `;
        } else if (f_date) {
            dateFilter = ` AND leads.createdAt >= :f_date `;
        } else if (t_date) {
            dateFilter = ` AND leads.createdAt <= :t_date `;
        }

        // Define status filter
        let statusFilter = '';
        if (status_id) {
            statusFilter = ` AND leads.stage = :status_id `;
        }

        // Handle role_id == 3 logic
        if (req.user.role_id == 3) {
            // Get all users reporting to the current user
            const getReportingManagers = `
            SELECT users.user_id, users.user
            FROM ${db_name}.db_users AS users
            WHERE users.report_to = :user_id
          `;

          const reportingManagers = await db.sequelize.query(getReportingManagers, {
              replacements: { user_id: req.user.user_id },
              type: db.sequelize.QueryTypes.SELECT
          });

          const reportingManagerIds = reportingManagers.map(user => user.user_id);
          reportingManagerIds.push(req.user.user_id); 

            const getReportingUsersQuery = `
              SELECT users.user_id, users.user
              FROM ${db_name}.db_users AS users
              WHERE users.report_to IN (:user_ids)
            `;

            const reportingUsers = await db.sequelize.query(getReportingUsersQuery, {
                replacements: { user_ids: reportingManagerIds },
                type: db.sequelize.QueryTypes.SELECT
            });

            // Extract user_ids from reporting users
            const reportingUserIds = reportingUsers.map(user => user.user_id);
            reportingUserIds.push(req.user.user_id); // Include current user's user_id
            // Fetch leads for both the current user and the users that report to them
            const getLeadsQuery = `
                SELECT leads.*, users.user_id, users.user, users.user_status
                FROM ${db_name}.db_channel_partner_leads as leads
                LEFT JOIN ${db_name}.db_users as users
                ON leads.asssigned_to = users.user_id
                WHERE leads.asssigned_to IN (:user_ids) AND leads.deletedAt IS NULL ${statusFilter} ${dateFilter}
                ORDER BY leads.createdAt DESC
            `;

            leads = await db.sequelize.query(getLeadsQuery, {
                replacements: { user_ids: reportingUserIds, f_date, t_date, status_id },
                type: db.sequelize.QueryTypes.SELECT
            });
        }
        else if (cpl_id) {
            // Fetch the specific lead with the provided cpl_id
            const getSingleLeadQuery = `
                SELECT leads.*, users.user_id, users.user, users.user_status 
                FROM ${db_name}.db_channel_partner_leads as leads
                LEFT JOIN ${db_name}.db_users as users
                ON leads.asssigned_to = users.user_id
                WHERE leads.cpl_id = :cpl_id ${statusFilter} ${dateFilter}
            `;

            const singleLead = await db.sequelize.query(getSingleLeadQuery, {
                replacements: { cpl_id, f_date, t_date, status_id },
                type: db.sequelize.QueryTypes.SELECT
            });

            if (singleLead.length === 0) {
                return await responseError(req, res, "No Lead Found with the Provided CPL ID");
            }

            leads = singleLead;
        }
        else if (bst_id) {
            let getAllLeadsQuery = `
                SELECT leads.*, users.user_id, users.user, users.user_status 
                FROM ${db_name}.db_channel_partner_leads as leads
                LEFT JOIN ${db_name}.db_users as users
                ON leads.asssigned_to = users.user_id
                WHERE leads.asssigned_to = :bst_id ${statusFilter} ${dateFilter}
                ORDER BY leads.createdAt DESC
            `;

            leads = await db.sequelize.query(getAllLeadsQuery, {
                replacements: { bst_id, f_date, t_date, status_id },
                type: db.sequelize.QueryTypes.SELECT
            });
        }
        else {
            let getAllLeadsQuery;

            if (req.user.isDB) {
                getAllLeadsQuery = `
                    SELECT leads.*, users.user_id, users.user, users.user_status
                    FROM ${db_name}.db_channel_partner_leads as leads
                    LEFT JOIN ${db_name}.db_users as users
                    ON leads.asssigned_to = users.user_id
                    WHERE 1=1 AND leads.deletedAt IS NULL ${statusFilter} ${dateFilter}
                    ORDER BY leads.createdAt DESC
                `;

            } else {
                getAllLeadsQuery = `
                    SELECT leads.*, users.user_id, users.user, users.user_status  
                    FROM ${db_name}.db_channel_partner_leads as leads
                    LEFT JOIN ${db_name}.db_users as users
                    ON leads.asssigned_to = users.user_id
                    WHERE leads.asssigned_to = :user_id AND leads.deletedAt IS NULL ${statusFilter} ${dateFilter} 
                    ORDER BY leads.createdAt DESC
                `;
            }

            leads = await db.sequelize.query(getAllLeadsQuery, {
                replacements: { user_id: req.user.user_id, f_date, t_date, status_id },
                type: db.sequelize.QueryTypes.SELECT
            });
        }

        return await responseSuccess(req, res, "Leads Retrieved Successfully", leads);

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
};

exports.updateChannelPartnerLeads = async (req, res) => {
    try {
        const { db_name, cpl_id, stage, follow_up_date, remarks, status, asssigned_to } = req.body;
        const now = new Date();
        const updatedAt = now.toISOString().slice(0, 19).replace('T', ' ');

        if (!db_name) {
            return responseError(req, res, "Client Database Name is Required");
        }

        if (!cpl_id) {
            return responseError(req, res, "CPL ID is Required");
        }

        // Check if the lead with the provided cpl_id exists
        const checkLeadQuery = `
            SELECT * FROM ${db_name}.db_channel_partner_leads 
            WHERE cpl_id = :cpl_id
        `;

        const existingLead = await db.sequelize.query(checkLeadQuery, {
            replacements: { cpl_id },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (existingLead.length === 0) {
            return responseError(req, res, "No Lead Found with the Provided CPL ID");
        }

        // Update the lead data in the db_channel_partner_leads table
        const updateLeadQuery = `
            UPDATE ${db_name}.db_channel_partner_leads 
            SET stage = :stage, updatedAt = :updatedAt,
            follow_up_date = :follow_up_date, remarks= :remarks,
            asssigned_to = :asssigned_to
            WHERE cpl_id = :cpl_id
        `;

        await db.sequelize.query(updateLeadQuery, {
            replacements: { stage, updatedAt, cpl_id, follow_up_date, remarks, asssigned_to },
            type: db.sequelize.QueryTypes.UPDATE
        });

        // Insert a new entry into db_channel_partner_lead_details with the provided follow_up_date and remarks
        const insertDetailsQuery = `
            INSERT INTO ${db_name}.db_channel_partner_lead_details 
            (cpl_id, stage, follow_up_date, remarks, status, createdAt, updatedAt)
            VALUES (:cpl_id, :stage, :follow_up_date, :remarks, :status, :createdAt, :updatedAt)
        `;

        await db.sequelize.query(insertDetailsQuery, {
            replacements: {
                cpl_id,
                stage,
                follow_up_date: follow_up_date || null, // Use provided follow_up_date, or null if not provided
                remarks: remarks || null,               // Use provided remarks, or null if not provided
                status: status !== undefined ? status : true,  // Use provided status, default to true if not provided
                createdAt: updatedAt,
                updatedAt
            },
            type: db.sequelize.QueryTypes.INSERT
        });

        return responseSuccess(req, res, "Lead Updated Successfully");

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return responseError(req, res, "Something Went Wrong");
    }
};

exports.deleteChannelPartnerLead = async (req, res) => {
    try {
        const { cpl_id } = req.query;

        if (!cpl_id) {
            return await responseError(req, res, "CPL ID is Required");
        }

        const cpl = await req.config.channelPartnerLeads.findOne({ where: { cpl_id: cpl_id } })

        if (!cpl) {
            return await responseError(req, res, "Channel Partner Lead not found");
        }

        await cpl.destroy()
        return await responseSuccess(req, res, "Lead Deleted Successfully");

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
}

exports.assignLeadsRoundRobin = async (req) => {
    try {
        // Fetch all unassigned leads (assumed to have `asssigned_to = null`)
        const unassignedLeads = await req.channelPartnerLeads.findAll({
            where: { asssigned_to: null, stage: 'OPEN', status: true }
        });

        if (unassignedLeads.length === 0) {
            console.log('No unassigned leads found.');
            return;
        }

        // Fetch all accounts with role_id = 2, sorted by createdAt
        const accounts = await req.users.findAll({
            where: { role_id: 2, user_status: true, deletedAt: null },
            order: [['createdAt', 'ASC']] // Sort accounts by createdAt (ascending)
        });

        if (accounts.length === 0) {
            console.log('No accounts found with role_id = 2');
            return;
        }

        // Total number of leads and accounts
        const totalLeads = unassignedLeads.length;
        const totalAccounts = accounts.length;

        // Fetch number of leads already assigned to each account
        const accountLeadCount = await Promise.all(accounts.map(async account => {
            const assignedLeadsCount = await req.channelPartnerLeads.count({ where: { asssigned_to: account.user_id } });
            return { account, assignedLeadsCount };
        }));
        // Sort accounts by their existing assigned leads, then by createdAt
        accountLeadCount.sort((a, b) => {
            if (a.assignedLeadsCount === b.assignedLeadsCount) {
                return new Date(a.account.createdAt) - new Date(b.account.createdAt);
            }
            return a.assignedLeadsCount - b.assignedLeadsCount;
        });
        console.log("accountLeadCount=============>>", accountLeadCount)

        // Divide leads among accounts
        const baseLeadsPerAccount = Math.floor(totalLeads / totalAccounts);
        let remainderLeads = totalLeads % totalAccounts; // Extra leads

        // Assign leads to each account in sorted order
        let leadIndex = 0;
        for (const { account } of accountLeadCount) {
            const leadsToAssign = baseLeadsPerAccount + (remainderLeads > 0 ? 1 : 0); // Extra leads to be fairly distributed

            // Assign the calculated number of leads to each account
            for (let i = 0; i < leadsToAssign && leadIndex < totalLeads; i++) {
                const lead = unassignedLeads[leadIndex];
                await lead.update({ asssigned_to: account.user_id });
                leadIndex++;
            }

            // Reduce the remainder leads after each assignment
            if (remainderLeads > 0) {
                remainderLeads--;
            }
        }
        console.log('Leads assigned successfully.');
        return
    } catch (error) {
        console.error('Error assigning leads:', error);
    }
}

async function assignLeadsRoundRobins(req) {
    try {
        // Fetch all unassigned leads (assumed to have `asssigned_to = null`)
        const unassignedLeads = await req.channelPartnerLeads.findAll({
            where: { asssigned_to: null, stage: 'OPEN', status: true }
        });

        if (unassignedLeads.length === 0) {
            console.log('No unassigned leads found.');
            return;
        }

        // Fetch all accounts with role_id = 2, sorted by createdAt
        const accounts = await req.users.findAll({
            where: { role_id: 2 },
            order: [['createdAt', 'ASC']] // Sort accounts by createdAt (ascending)
        });

        if (accounts.length === 0) {
            console.log('No accounts found with role_id = 2');
            return;
        }

        // Total number of leads and accounts
        const totalLeads = unassignedLeads.length;
        const totalAccounts = accounts.length;

        // Fetch number of leads already assigned to each account
        const accountLeadCount = await Promise.all(accounts.map(async account => {
            const assignedLeadsCount = await req.channelPartnerLeads.count({ where: { asssigned_to: account.user_id } });
            return { account, assignedLeadsCount };
        }));
        console.log("accountLeadCount=============>>", accountLeadCount)
        // Sort accounts by their existing assigned leads, then by createdAt
        accountLeadCount.sort((a, b) => {
            if (a.assignedLeadsCount === b.assignedLeadsCount) {
                return new Date(a.account.createdAt) - new Date(b.account.createdAt);
            }
            return a.assignedLeadsCount - b.assignedLeadsCount;
        });
        console.log("accountLeadCount=============>>", accountLeadCount)

        // Divide leads among accounts
        const baseLeadsPerAccount = Math.floor(totalLeads / totalAccounts);
        let remainderLeads = totalLeads % totalAccounts; // Extra leads

        // Assign leads to each account in sorted order
        let leadIndex = 0;
        for (const { account } of accountLeadCount) {
            const leadsToAssign = baseLeadsPerAccount + (remainderLeads > 0 ? 1 : 0); // Extra leads to be fairly distributed

            // Assign the calculated number of leads to each account
            for (let i = 0; i < leadsToAssign && leadIndex < totalLeads; i++) {
                const lead = unassignedLeads[leadIndex];
                await lead.update({ asssigned_to: account.user_id });
                leadIndex++;
            }

            // Reduce the remainder leads after each assignment
            if (remainderLeads > 0) {
                remainderLeads--;
            }
        }
        console.log('Leads assigned successfully.');
        return
    } catch (error) {
        console.error('Error assigning leads:', error);
    }
}

exports.assignLeads = async (req, res) => {
    try {
        await assignLeadsRoundRobins(req)
        return await responseSuccess(req, res, "Leads assigned successfully");

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return await responseError(req, res, "Something Went Wrong");
    }
}

exports.getLeadDetails = async (req, res) => {
    try {
        const { db_name, cpl_id } = req.query;

        if (!db_name) {
            return responseError(req, res, "Client Database Name is Required");
        }

        if (!cpl_id) {
            return responseError(req, res, "CPL ID is Required");
        }

        // Query to fetch all lead details based on cpl_id
        const leadDetailsQuery = `
            SELECT * FROM ${db_name}.db_channel_partner_lead_details
            WHERE cpl_id = :cpl_id
            ORDER BY createdAt DESC
        `;

        const leadDetails = await db.sequelize.query(leadDetailsQuery, {
            replacements: { cpl_id },
            type: db.sequelize.QueryTypes.SELECT
        });

        if (leadDetails.length === 0) {
            return responseError(req, res, "No Lead Details Found for the Provided CPL ID");
        }

        return responseSuccess(req, res, "Lead Details Retrieved Successfully", leadDetails);

    } catch (error) {
        logErrorToFile(error);
        console.log(error);
        return responseError(req, res, "Something Went Wrong");
    }
};
