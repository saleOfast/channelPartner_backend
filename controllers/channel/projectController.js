const { Sequelize, DataTypes, QueryTypes, where, Op } = require("sequelize");
const {responseError, responseSuccess} = require('../../helper/responce')
const fileUpload = require("../../common/imageExport");
var fs = require("fs");
const path = require("path");

// for admin
exports.storeChannelProject = async(req, res) => {
    try {
        let {project} = req.body
        let projectData;

        projectData = await req.config.channelProject.findOne({where:{project:project
        }})

        if(projectData) return await responseError(req, res, "project name already exist")

        let body = {...req.body, status:true, created_by: req.user.user_id}

        if (req.files && req.files.file) {
            req.body._imageName = 0
            let cover_image =  await fileUpload.imageExport(req, res, "project");
            body.cover_image = cover_image;
        }

        if (req.files && req.files.logo) {
            req.body._imageName = 0
            let logo_image =  await fileUpload.imageExport(req, res, "projectLogo", "logo");
            body.logo_image = logo_image;
        }

        if (req.files && req.files.template) {
            req.body._imageName = 0
            let html_file =  await fileUpload.imageExport(req, res, "projectHtml", "template");
            body.html_file = html_file;
        }

        delete body.project_id
        console.log("body",body)

        projectData =  await req.config.channelProject.create(body)
        return await responseSuccess(req, res, "project created Succesfully", projectData )
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error, "error")
        return await responseError(req, res, "Something Went Wrong")
    }
}

// for admin
exports.storeUserChannelTemplate = async(req, res) => {
    try {
        const {project_id, contact_no} = req.body
        let projectData;

        projectData = await req.config.userProjectModel.findOne(
            {where:{project_id, created_by: req.user.user_id}}
        )

        let projectMainData = await req.config.channelProject.findByPk(project_id)

        let newData = {...projectMainData.dataValues}
        delete newData.logo_image
        
        let body = {...projectMainData.dataValues, status:true, created_by: req.user.user_id, contact_no: contact_no}
        if (req.files && req.files.logo) {
            req.body._imageName = projectData?.logo_image || 0
            let logo_image =  await fileUpload.imageExport(req, res, "projectLogo", 'logo');
            body.logo_image = logo_image;
        }

      

        if(projectData) {
            if (req.body.logo_preview === 'null') {
                req.body._imageName = projectData.logo_image || 0
                await fileUpload.deleteImage(req, res, "projectHtml", 'logo');
                body.logo_image = null; 
            }
            await projectData.update(body)
            return await responseSuccess(req, res, "project template updation success", projectData)
        }else{
            projectData = await req.config.userProjectModel.create(body)
            return await responseSuccess(req, res, "project template creation successfull", projectData)
        }
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error, "error")
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.getChannelProject = async(req, res) =>{
    try {
        let projectData ;
        if(req.query.project_id){
            if(req.user.isDB){
                projectData = await req.config.channelProject.findByPk(req.query.project_id)
            }else{
                projectData = await req.config.userProjectModel.findOne({
                    where: {project_id: req.query.project_id, created_by: req.user.user_id}
                })
                if(!projectData){
                    projectData = await req.config.channelProject.findByPk(req.query.project_id)
                }
            }
            let htmlTemplate = ''
            if(projectData.html_file) {
                const htmlTemplatePath  = path.resolve(
                    __dirname,
                    `../../uploads/projectHtml/images${projectData.html_file}`
                  );
                // htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf-8");
                if (fs.existsSync(htmlTemplatePath)) {
                    htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');
                  } else {
                    console.warn(`HTML file not found: ${htmlTemplatePath}`);
                  }
            }
            
            return await responseSuccess(req, res, "project Data", {projectData, htmlTemplate})
        }else{
            projectData = await req.config.channelProject.findAll({ })
            return await responseSuccess(req, res, "project list", projectData)
        }
       
       
    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.editChannelProject = async(req, res) =>{
    try {

        let {project , project_id} = req.body
        let body = req.body

        let CurrentProjectData = await req.config.channelProject.findByPk(project_id)
        if(!CurrentProjectData) return await responseError(req, res, "project not found") 

        if(project) {
            let projectData = await req.config.channelProject.findOne({
                where:{
                    project_id: {[Op.ne]: project_id},
                    project: project
                }
            })
            if(projectData) return await responseError(req, res, "project name already existed") 
        }

        if (req.files && req.files.file) {
            req.body._imageName = CurrentProjectData.cover_image || 0
            let cover_image =  await fileUpload.imageExport(req, res, "project");
            body.cover_image = cover_image;
        }

        if (req.files && req.files.logo) {
            req.body._imageName = CurrentProjectData.logo_image || 0
            let logo_image =  await fileUpload.imageExport(req, res, "projectLogo", 'logo');
            body.logo_image = logo_image;
        }

        if (req.files && req.files.template) {
            req.body._imageName = CurrentProjectData.html_file || 0
            let html_file =  await fileUpload.imageExport(req, res, "projectHtml", 'template');
            body.html_file = html_file; 
        }

        if (req.body.template_name === 'null') {
            console.log("inside null")
            req.body._imageName = CurrentProjectData.html_file || 0
            await fileUpload.deleteImage(req, res, "projectHtml", 'template');
            body.html_file = null; 
        }

        if (req.body.file_preview === 'null') {
            req.body._imageName = CurrentProjectData.cover_image || 0
            await fileUpload.deleteImage(req, res, "projectHtml", 'template');
            body.cover_image = null; 
        }

        if (req.body.logo_preview === 'null') {
            req.body._imageName = CurrentProjectData.logo_image || 0
            await fileUpload.deleteImage(req, res, "projectHtml", 'template');
            body.logo_image = null; 
        }
     
            await CurrentProjectData.update(body)
            return await responseSuccess(req, res, "project updated" , {data: req.body.template_name, file: req.body.template  })

    } catch (error) {
    logErrorToFile(error)
        console.log("error", error)
        return await responseError(req, res, "Something Went Wrong")
    }
}

exports.deleteChannelProject = async(req, res) =>{
    try {

        let {project_id} = req.query
        let projectData = await req.config.channelProject.findOne({
            where:{
                project_id
            }
        })

        if(!projectData) return await responseError(req, res, "project name does not existed") 
        await projectData.destroy()
        return await responseSuccess(req, res, "project deleted")

    } catch (error) {
    logErrorToFile(error)
        console.log(error)
        return await responseError(req, res, "Something Went Wrong")
    }
}