import { Schema, model } from "mongoose";


const subcategorySchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    slug : {
        type : String,
        lowercase : true
    },
    category : {
        type : Schema.Types.ObjectId,
        ref : "Category",
        required : true
    },
    image : {
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

const subcategoryModel = model("Subcategory" , subcategorySchema);

export default subcategoryModel;