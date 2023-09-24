import { asyncHandler } from "../../utils/asyncHandler.js";
import productModel from '../../../database/models/product.model.js'
import cartModel from '../../../database/models/cart.model.js'



export const addtocart = asyncHandler(async (req,res,next) => {
    const {productId , quantity} = req.body;

    const product = await productModel.findById(productId);
    if (!product) return next(new Error("product not found!" , {cause : 404}))

    if (!product.inStock(quantity)) {
        return next(new Error("AvailableItems limit exceeded!" , {cause : 400}))
    }
    const isProductInCart = await cartModel.findOne({
        user : req.user._id,
        'products.productId' : productId
    });

    if (isProductInCart) {
        isProductInCart.products.forEach((productObj) => {
            if (
                productObj.productId.toString() === productId.toString() &&
                productObj.quantity + quantity < product.availableItems 
            ) {
                productObj.quantity = productObj.quantity + quantity
            }
            if (productObj.quantity + quantity > product.availableItems ) {
                return next(new Error("avaliable items exceed"))
            }
        })
        await isProductInCart.save();
        const cart = await cartModel.find({user : req.user._id})
        return res.json({success : true, msg : "item added to cart successfully" , results : cart})
    } else {
        const cart = await cartModel.findOneAndUpdate(
                { user : req.user._id },
                { $push : { products : { productId,quantity } } },
                { new : true }
            );
            return res.json({success : true, msg : "item added to cart successfully" , results : cart})
    }
});

export const userCart = asyncHandler(async (req,res,next) => {
    const cart = await cartModel.findOne({user : req.user._id}).populate({
        path :'products.productId',
        select : 'title price discount finalPrice imageCover.url'
    });
    return res.json({success:true , result : cart})
})

export const updateCart = asyncHandler(async (req,res,next) => {
    const {productId , quantity} = req.body;

    const product = await productModel.findById(productId);
    if (!product) return next(new Error("product not found!" , {cause : 404}))

    if (product.inStock(quantity)) {
        return next(new Error("AvailableItems limit exceeded!" , {cause : 400}))
    }

    const cart = await cartModel.findOneAndUpdate(
        {user : req.user._id , 'products.productId' : productId} , 
        { $set : {"products.$.quantity" : quantity} },
        { new : true }
    )

    return res.json({success:true , result : cart})
});

export const removeProductFromCart = asyncHandler(async (req,res,next) => {
    const cart = await cartModel.findOneAndUpdate(
        {user : req.user._id} ,
        { $pull : { products : { productId: req.params.productId } } },
        {new:true}
    );
    return res.json({success:true ,msg : "product removed successfully!", results : cart})
})

export const clearCart = asyncHandler(async (req,res,next) => {
    const cart = await cartModel.findOneAndUpdate(
        {user:req.user._id },
        {products : []},
        {new : true}
    )
    return res.json({success:true ,msg : "cart clearfied successfully", results : cart})
})