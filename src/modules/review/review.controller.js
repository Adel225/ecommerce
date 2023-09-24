import productModel from "../../../database/models/product.model.js";
import reviewModel from "../../../database/models/reveiw.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const addReview = asyncHandler(async (req,res,next) => {
    const { productId, content } = req.body;
    const review = await reviewModel.create({
        user : req.user._id,
        content 
    });
    const isProductExist = await productModel.findById(productId)
    if (!isProductExist) {
        return next(new Error("Invalid product id!" , {cause : 404}))
    }
    const product = await productModel.findByIdAndUpdate(productId , {
        $push : { reviews : { id : review._id } }
    })
    return res.json({success:true,msg : "review added successfully", results : review})
})