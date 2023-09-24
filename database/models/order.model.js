import mongoose,{ Schema, Types } from "mongoose";

const orderSchema = new Schema({
    products : [
        {
            productId: {type: Types.ObjectId , ref : "Product"},
            _id : false,
            quantity : {type : Number , min : 1},
            name : String,
            itemPrice: Number,
            totalPrice : Number
        }
    ],
    user : {
        type : String,
        ref : "User",
        required : true
    },
    invoice : {id: String, url : String},
    address : {type : String, required : true},
    price : {type: Number, required:true},
    phone : {type : String, required : true},
    copoun : {
        id : {type : Types.ObjectId, ref: 'Copoun'},
        discount : {type : Number, min:1 , max:100},
        code : {type : String}
    },
    status : {
        type : String,
        enum : ['placed','shipped','delivered','canceled','refunded'],
        default : 'placed',
    },
    payment : {
        type : String,
        enum : ["cash","visa"],
        default : 'cash'
    }
},{
    timestamps:true,
    toJSON : {virtuals : true}
})

orderSchema.virtual("finalPrice").get(function () {
    return this.copoun ?
        Number.parseFloat(
            this.price - (this.price * this.copoun.discount) / 100
        ).toFixed(2) : this.price;
});

const orderModel = mongoose.model('Order', orderSchema);

export default orderModel