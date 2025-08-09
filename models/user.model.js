import mongoose from 'mongoose';

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    profilePic:{
        type:String,
        default:null,
    },
    profileName:{
        type:String,
        default:null,
    },
    mobile:{
        type:String,
        default:null,
    },
    projectCount:{
        type:Number,
        default:0,
    },
},{timestamps:true});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;