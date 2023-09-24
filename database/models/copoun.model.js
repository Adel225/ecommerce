import mongoose ,{Schema, Types } from "mongoose"

const copounSchema = new Schema({
    code: {
        type: String,
        required: true,
        trim : true,
    },
    expires : {
        type: Number,
    },
    discount : {
        type: Number,
        required: true,
        min : 0,
        max : 100
    },
    createdBy : {
        required : true ,
        type : Types.ObjectId,
        ref : "User"
    }
},{timestamps: true})

const copounModel = mongoose.model("Copoun", copounSchema)

export default copounModel