import * as mongoose from "mongoose";

const projectSchema=new mongoose.Schema({
    ProjectName:{
        type:String,
        required:true,
        unique:true,
    },
    ProjectDescription:{
        type:String,
        required:true,
    },
    ProjectCategory:{
        type:String,
        required:true,
    },
    ProjectTechnologies:{
        type:Array,
        required:true,
    },
    ProjectOwner:{
        type:String,
        required:true,
    },
    ProjectMembers:{
        type:Array,
    },
    ProjectStatus:{
        type:String,
        required:true,
    },
    ProjectImage:{
        type:[String],
        required:true,
    },
    ProjectWebsiteLink:{
        type:String,
        required:true,
    },
    ProjectGithubLink:{
        type:String,
        required:true,
    }
})

const Project=mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;