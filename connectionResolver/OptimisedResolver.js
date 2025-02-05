const { Sequelize, DataTypes } = require("sequelize");
const db = require("../model/index.js");
const user = db.clients;
const { promisify } = require("util");
const cron = require('node-cron');
const jwt = require("jsonwebtoken");
const dbConfig = require("../config/db.config.js");
const { responseError } = require("../helper/responce.js");
const { assignLeadsRoundRobin } = require('../controllers/contactUsController.js');
const { sendMailToLeadOwners } = require("../controllers/channel/channelLeadController.js");
const { sendMailToReportTos } = require("../controllers/userController.js");

const tenants = {};

// Optimized resolver middleware
exports.resolver = async (req, res, next) => {
  try {
    // Extract and verify JWT token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) return res.status(400).json({ message: "No Token Found!" });

    const decoded = await promisify(jwt.verify)(token, process.env.CLIENT_SECRET);
    
    const clientUser = await user.findOne({
      where: {
        user_code: decoded.user_code,
      },
    });
    if (!clientUser) return res.status(400).json({ message: "Auth Failed No User found!" });

    // If tenant connection doesn't exist, create it
    if (!tenants[decoded.user_code]) {
      console.log(`Creating a new connection for tenant: ${decoded.user_code}`);

      tenants[decoded.user_code] = new Sequelize(
        clientUser.db_name, // Database name (unique to each tenant)
        dbConfig.USER,
        dbConfig.PASSWORD,
        {
          host: dbConfig.HOST,
          dialect: 'mysql',
          logging: false,
          pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
          },
          define: {
            timestamps: false
          },
          timezone: "+05:30",
        }
      );

      // Check if connection to tenant DB is successful
      await tenants[decoded.user_code].authenticate();
      console.log(`Connection established with tenant: ${clientUser.db_name}`);

      // Load models associated with the tenant's connection
      const Userdb = loadTenantModels(tenants[decoded.user_code]);

      // Sync models (optional, could be used only during development)
      await tenants[decoded.user_code].sync({ alter: false });
      console.log(`DB for tenant ${clientUser.db_name} has been synced`);

      // Fetch the admin user details and store in tenant object
      const adminUser = await Userdb.users.findOne({
        where: {
          isDB: true
        },
        attributes: ['user', 'user_l_name', 'client_url', 'db_name']
      });

      tenants[decoded.user_code].admin = adminUser;

      // Start cron jobs for tenant-specific tasks
      startCronJobs(tenants[decoded.user_code]);
    }

    // Set tenant's Sequelize instance, user data, and admin data in the request object
    req.config = tenants[decoded.user_code]; // Tenant's DB connection
    req.user = decoded; // User info from the JWT token
    req.admin = tenants[decoded.user_code].admin; // Admin user information

    next();
  } catch (error) {
    console.error('Error in resolver:', error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
};

// Helper function to load tenant-specific models
const loadTenantModels = (sequelizeInstance) => {
  const Userdb = {};
  Userdb.Sequelize = Sequelize;
  Userdb.sequelize = sequelizeInstance;

  // Load models specific to each tenant
  Userdb.emailTemplates = require("../model/emailTemplatesModel.js")(sequelizeInstance, DataTypes);
  Userdb.users = require("../model/userModel.js")(sequelizeInstance, DataTypes);
  Userdb.leads = require("../model/leadModel.js")(sequelizeInstance, DataTypes);
  Userdb.organisationInfo = require("../model/organisationInfo.js")(sequelizeInstance, DataTypes);
  Userdb.userProfiles = require("../model/userProfileModel.js")(sequelizeInstance, DataTypes);
  Userdb.user_role = require("../model/userRoleModel.js")(sequelizeInstance, DataTypes);
  Userdb.channelPartnerLeads = require("../model/contactUsModel.js")(sequelizeInstance, DataTypes);
  
  // Add relationships and associations
  Userdb.states = require("../model/StateModel.js")(sequelizeInstance, DataTypes);
  Userdb.city = require("../model/cityModel.js")(sequelizeInstance, DataTypes);

  Userdb.states.hasMany(Userdb.organisationInfo, { foreignKey: 'state_id' });
  Userdb.organisationInfo.belongsTo(Userdb.states, { foreignKey: 'state_id' });

  Userdb.city.hasMany(Userdb.organisationInfo, { foreignKey: 'city_id' });
  Userdb.organisationInfo.belongsTo(Userdb.city, { foreignKey: 'city_id' });

  return Userdb;
};

// Function to start tenant-specific cron jobs
const startCronJobs = (sequelizeInstance) => {
  // Assign leads in round-robin manner for tenant
  let assignLeadsJob = cron.schedule('* * * * *', async () => {
    await assignLeadsRoundRobin(sequelizeInstance);
  });
  assignLeadsJob.start();

  // Send mail to lead owners
  let sendMailToLeadOwnersJob = cron.schedule('* * * * *', async () => {
    await sendMailToLeadOwners(sequelizeInstance);
  });
  sendMailToLeadOwnersJob.start();

  // Send mail to report-tos
  let sendMailToReportTosJob = cron.schedule('* * * * *', async () => {
    await sendMailToReportTos(sequelizeInstance);
  });
  sendMailToReportTosJob.start();
};
