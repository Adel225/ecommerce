import mongoose ,{Schema, Types } from "mongoose"

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim : true,
        min : [10 , "too short product name"]
    },
    reviews : [{
        id : {
            ref : "Review",
            type : Types.ObjectId}
    }],
    slug : {
        type: String,
        lowercase: true
    }, 
    price : {
        type: Number,
        required: true,
        default : 0,
        min : [0, "price must be greater than 0"]
    },
    discount : {
        type: Number,
        min : 1,
        max : 100
    },
    description : {
        type: String,
        required: true,
        min : [10, "too short product description"],
        trim : true
    },
    stock : {
        type: Number,
        default : 0,
        min : [0, "stock must be greater than 0"]
    },
    soldItems : {
        type: Number,
        default : 0,
    },
    availableItems : {type : Number, min : 1,required : true},
    imageCover : {
        url : {type: String, required: true},
        id : {type: String, required: true}
    },
    images : [
        {
            url : {type: String, required: true},
            id : {type: String, required: true}
        }
    ],
    category : {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory : {
        type: Schema.Types.ObjectId,
        ref: "Subcategory",
        required: true
    },
    brand : {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    ratingAvg : {
        type: Number,
        min : 0.1,
        max : 5,
    },
    ratingCount : {
        type: Number,
        min : 0,
    },
    cloudFolder : {type : String, unique: true},
    createdBy : {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps: true,
    strictQuery: true,
    toJSON : {virtuals : true}
})

productSchema.virtual("finalPrice").get(function () {
    if (this.price) {
        return Number.parseFloat(
            this.price - (this.price * this.discount || 0) / 100
        ).toFixed(2);
    }
});

productSchema.query.paginate = function (page) {
    page = !page || isNaN(page) || page < 1 ? 1 : page;
    const limit = 2;
    const skip = (page - 1) * limit ;
    return this.skip(skip).limit(limit);
}

productSchema.query.customSelect = function (fields) {
    if (!fields) return this;
    const modelKeys = Object.keys(productModel.schema.paths);
    const queryKeys = fields.split(" ");
    const matchedKeys = queryKeys.filter((key) => modelKeys.includes(key));
    return this.select(matchedKeys);
}

productSchema.methods.inStock = function (quantity) {
    return this.availableItems >= quantity ? true : false;
}

const productModel = mongoose.model("Product", productSchema)

export default productModel