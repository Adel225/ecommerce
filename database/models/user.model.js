import mongoose, { Schema, model } from "mongoose";


const userSchema = new Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
        min: 5,
        max: 20
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
    },
    status : {
        type : String,
        enum : ['offline', 'online'],
        default :'offline'
    },
    gender : {
        type : String,
        enum : ['male', 'female'],
        default :'male'
    },
    phone : {
        type : String,
        required : true,
        unique : true,
        min: 10,
        max: 10
    },
    isConfirmed : {
        type : Boolean,
        default : false
    },
    blocked : {
        type : Boolean,
        default : false
    },
    forgetCode : {
        type : String,
    },
    activationCode : {
        type : String,
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    profileImage : {
        url : {
            type : String,
            default : "https://res.cloudinary.com/dwcy6vc23/image/upload/v1691015826/ecommerce/userDefault/th_nzvg6u.jpg"
        },
        id : {
            type : String,
            default : "ecommerce/userDefault/th_nzvg6u"
        }
    },
    coverImage : {
        url : {
            type : String
        },
        id : {
            type : String
        }
    }
},
{timestamps: true})

const userModel = mongoose.models.User || model("User" , userSchema);

export default userModel;