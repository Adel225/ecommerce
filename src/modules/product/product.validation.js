import joi from 'joi'
import {Types} from 'mongoose'

const isValidObjectID = (value , helper) => {
    return Types.ObjectId.isValid(value) 
    ? true 
    : helper.message("Invalid objectID!");
}

export const createProductSchema = {
    body : joi.object({
        title : joi.string().min(2).max(100).required(),
        description : joi.string().min(10).max(300).required(),
        price : joi.number().min(1).required(),
        priceAfterDiscount : joi.number().min(1),
        availableItems : joi.number().min(1).required(),
        category : joi.string().custom(isValidObjectID).required(),
        subcategory : joi.string().custom(isValidObjectID).required(),
        brand : joi.string().custom(isValidObjectID).required(),
    }).required()
}

export const productIdSchema = {
    params : joi.object({
        productId : joi.string().custom(isValidObjectID).required(),
    }).required()
}
