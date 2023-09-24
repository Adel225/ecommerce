import mongoose ,{ Schema , model } from "mongoose";


const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isValid : {
        type : Boolean,
        default : true
    },
    agent :{
        type : String
    },
    expiredAt : {
        type : String
    }
},{timestamps : true})

const tokenModel = model.Token || model("Token", tokenSchema);
export default tokenModel