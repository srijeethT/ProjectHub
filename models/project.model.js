import * as mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    ProjectName: {
        type: String,
        required: true,
        unique: true,
    },
    ProjectDescription: {
        type: String,
        required: true,
    },
    ProjectCategory: {
        type: String,
        required: true,
    },
    ProjectTechnologies: {
        type: Array,
        required: true,
    },
    ProjectOwner: {
        type: String,
        required: true,
    },
    ProjectMembers: {
        type: Array,
        default: [],
    },
    ProjectStatus: {
        type: String,
        required: true,
    },
    ProjectImage: {
        type: [String],
        required: true,
    },
    ProjectWebsiteLink: {
        type: String,
        required: true,
    },
    ProjectGithubLink: {
        type: String,
        required: true,
    },
    ProjectDate: {
        type: Date,
        default: Date.now,
    },
    ProjectComments: {
        type: Array,
        default: [],
    },
    ProjectLikes: {
        type: Array,
    },
    ProjectCost:{
        type: Number,
        default: 0,
        required: true,
    },
    ProjectRating:{
        type: Number,
    },
    ProjectRatingCount:{
        type: Number,
    },
    ProjectRatingAverage:{
        type: Number,
    },
    ProjectViews:{
        type: Number,
        default: 0,
    }
});

// 🔹 Ensure ProjectOwner is in ProjectMembers
projectSchema.pre("save", function (next) {
    if (this.ProjectOwner) {
        if (!Array.isArray(this.ProjectMembers)) {
            this.ProjectMembers = [];
        }
        if (!this.ProjectMembers.includes(this.ProjectOwner)) {
            this.ProjectMembers.push(this.ProjectOwner);
        }
    }
    next();
});

// Also do it for `findOneAndUpdate` type updates
projectSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.ProjectOwner) {
        if (!update.ProjectMembers) update.ProjectMembers = [];
        if (!update.ProjectMembers.includes(update.ProjectOwner)) {
            update.ProjectMembers.push(update.ProjectOwner);
        }
        this.setUpdate(update);
    }
    next();
});

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
