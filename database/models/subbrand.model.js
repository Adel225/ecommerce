import { Schema, model } from "mongoose";


const subbrandSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    slug : {
        type : String,
        lowercase : true
    },
    brand : {
        type : Schema.Types.ObjectId,
        ref : "Brand",
        required : true
    },
    logo : {
        url : {type: String, required: true},
        id : {type: String, required: true}
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},
{timestamps : true});

const subbrandModel = model("Subbrand" , subbrandSchema);

export default subbrandModel;