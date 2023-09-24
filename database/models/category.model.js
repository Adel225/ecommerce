import mongoose ,{Schema } from "mongoose"
import subcategoryModel from "./sub-category.model.js"

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique : true,
        trim : true,
        minlength: [5 , "name is too short"],
    },
    slug : {
        type: String,
        lowercase: true
    }, 
    image : {
        url : {type: String, required: true},
        id : {type: String, required: true}
    },
    createdBy : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true , toJSON : {virtuals : true} , toObject : {virtuals : true} })

categorySchema.virtual("subcategory" , {
    ref: "Subcategory",
    localField: "_id",
    foreignField: "category"
})

categorySchema.pre("remove" , async function() {
    await subcategoryModel.deleteMany({category : this._id})
})

const categoryModel = mongoose.model("Category", categorySchema)

export default categoryModel