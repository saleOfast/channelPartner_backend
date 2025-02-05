//importing modules
const { Sequelize, DataTypes } = require("sequelize");
// const config = require(`./config/${process.env.NODE_ENV || 'development'}`);
const dbConfig = require('../config/db.config.js')
// connecting database


const sequelize = new Sequelize(
  dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: "mysql",
    logging: false,
    timezone: "+05:30", dialectOptions: {
      // useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true,
      timezone: "+05:30",
      connectTimeout: 10000 // 10 seconds in milliseconds
    }, pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected to discover`);
  }).catch((err) => {
    console.log(err);
    throw (err)
  });


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
//connecting to model

db.clients = require("./clientModel")(sequelize, DataTypes);
db.emailTemplates = require("./emailTemplatesModel.js")(sequelize, DataTypes);
db.settings = require('./generalSettings.js')(sequelize, DataTypes);
db.supers = require("./superAdminModel")(sequelize, DataTypes);
db.menus = require("./menuModel")(sequelize, DataTypes);
db.clientPermissions = require("./clientPermissionModel")(sequelize, DataTypes);
db.country = require("./countryModel")(sequelize, DataTypes);
db.states = require("./StateModel")(sequelize, DataTypes);
db.city = require("./cityModel")(sequelize, DataTypes);
db.district = require("./districtModel")(sequelize, DataTypes);
db.platform = require("./platformModel.js")(sequelize, DataTypes);
db.clientPlatform = require("./clientPlatformModel.js")(sequelize, DataTypes);
db.platformHistory = require("./platformHistory.js")(sequelize, DataTypes);
db.loginLogger = require("./loginLogger.js")(sequelize, DataTypes);
db.cpType = require('../model/channelPartnerType.js')(sequelize, DataTypes);

db.currency = require("../model/countryCurrencyModel.js")(sequelize, DataTypes);

db.menus.hasMany(db.clientPermissions, { foreignKey: 'menu_id' })
db.clientPermissions.belongsTo(db.menus, { foreignKey: 'menu_id' })

db.clients.hasMany(db.clientPermissions, { foreignKey: 'user_id' })
db.clientPermissions.belongsTo(db.clients, { foreignKey: 'user_id' })

db.platform.hasMany(db.clientPlatform, { foreignKey: 'platform_id' })
db.clientPlatform.belongsTo(db.platform, { foreignKey: 'platform_id' })

db.clients.hasMany(db.clientPlatform, { foreignKey: 'client_id' })
db.clientPlatform.belongsTo(db.clients, { foreignKey: 'client_id' })

db.clients.hasMany(db.platformHistory, { foreignKey: 'user_id' })
db.platformHistory.belongsTo(db.clients, { foreignKey: 'user_id' })

db.supers.hasMany(db.platformHistory, { as: "updatedBy", foreignKey: 'updated_by' })
db.platformHistory.belongsTo(db.supers, { as: "updatedBy", foreignKey: 'updated_by' })

db.platform.hasMany(db.platformHistory, { foreignKey: 'platform_id' })
db.platformHistory.belongsTo(db.platform, { foreignKey: 'platform_id' })

db.supers.hasMany(db.loginLogger, { foreignKey: 'user_id' })
db.loginLogger.belongsTo(db.supers, { foreignKey: 'user_id' })

module.exports = db;
