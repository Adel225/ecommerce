import mongoose,{ Schema, Types } from "mongoose"


const cartSchema = new Schema({
    user : {
        type : Types.ObjectId,
        ref : "User",
        unique : true,
        required : true
    },
    products : [
        {
            productId : {type : Types.ObjectId , ref : "Product", unique : true},
            quantity : {type : Number, default : 1}
        }
    ]
},{timestamps : true});

const cartModel = mongoose.model('Cart', cartSchema);

export default cartModel