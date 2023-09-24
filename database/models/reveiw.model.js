import mongoose, { Schema,Types } from "mongoose";


const reviewSchema = new Schema({
    user : { type: Types.ObjectId, ref : "User", required : true },
    content: {type : String, required : true}
},
{
    timestamps: true
});

const reviewModel = mongoose.model("Review" , reviewSchema);

export default reviewModel