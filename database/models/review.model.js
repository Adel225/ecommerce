import mongoose ,{Schema } from "mongoose"

const reviewSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim : true,
    },
    product : {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: "User",
        enum : [1,2,3,4,5]
    },
    rate : {
        type: Number,
        required: true
    }
},{timestamps: true})

const reviewModel = mongoose.model("Review", reviewSchema)

export default reviewModel