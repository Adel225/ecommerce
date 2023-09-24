import mongoose ,{Schema } from "mongoose"

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique : true,
        trim : true,
    },
    slug : {
        type: String,
        lowercase: true
    }, 
    logo : {
        url : {type: String, required: true},
        id : {type: String, required: true}
    },
    createdBy : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true , toJSON : {virtuals : true} , toObject : {virtuals : true}})

brandSchema.virtual("subbrand" , {
    ref: "Subbrand",
    localField: "_id",
    foreignField: "brand"
})

const brandModel = mongoose.model("Brand", brandSchema)

export default brandModel