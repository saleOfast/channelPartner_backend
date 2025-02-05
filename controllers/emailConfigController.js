const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../helper/responce')


exports.createEmailConfig = async (req, res) => {
    
  
    const { host, port, user, password, from } = req.body;
  
    try {
      
      const existingCount = await req.config.emailConfig.count({});
      if (existingCount > 0) return await responseError(req, res, "Email configuration already exists")

    
      const newConfig = await req.config.emailConfig.create({ host, port, user, password, from });

      return await responseSuccess(req, res, "Email Config created Succesfully", newConfig )

    } catch (error) {
    logErrorToFile(error)
      console.log('Error creating email configuration:', error);      
      return await responseError(req, res, "Something Went Wrong")
    }
  };

  exports.updateEmailConfig = async (req, res) => {
    
    const { email_config_id, host, port, user, password, from } = req.body;
  
    try {
      const config = await req.config.emailConfig.findByPk(email_config_id);
      if (!config) {
        return await responseError(req, res, "Email configuration not found")
      }
  
      config.host = host;
      config.port = port;
      config.user = user;
      config.password = password;
      config.from = from;
  
      await config.save();
      return await responseSuccess(req, res, "Email Config Updated Succesfully", config )

    } catch (error) {
    logErrorToFile(error)
      console.log('Error updating email configuration:', error);
      return await responseError(req, res, "Something Went Wrong")
    }
  };
  
  exports.getSingleEmailConfig = async (req, res) => {
    
  
    try {
      const config = await req.config.emailConfig.findAll();
      
      return await responseSuccess(req, res, "Email Config", config )
    } catch (error) {
    logErrorToFile(error)
      console.log('Error fetching single email configuration:', error);
      return await responseError(req, res, "Something Went Wrong")
    }
  };
  