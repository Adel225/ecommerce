import joi from "joi";
import { Types } from "mongoose";

const isValidObjectID = (value , helper) => {
    return Types.ObjectId.isValid(value) 
    ? true 
    : helper.message("Invalid objectID!");
}

export const createBrand = joi.object({
    name: joi.string().required(),
    createdBy : joi.string().custom(isValidObjectID)
}).required()

export const updateBrand = joi.object({
    name: joi.string(),
    brandID : joi.string().custom(isValidObjectID)
}).required()

export const deleteBrand = joi.object({
    brandID : joi.string().custom(isValidObjectID).required()
})

