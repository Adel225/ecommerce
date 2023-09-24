import joi from "joi";
import { Types } from "mongoose";

export const isValidObjectID = (value , helper) => {
    return Types.ObjectId.isValid(value) 
    ? true 
    : helper.message("Invalid objectID!");
}

export const createCategorySchema = joi.object({
    name: joi.string().required(),
    createdBy : joi.string().custom(isValidObjectID).required()
}).required()

export const updateCategorySchema = joi.object({
    name: joi.string(),
    categoryID : joi.string().custom(isValidObjectID)
}).required()

export const deleteCategory = joi.object({
    categoryID : joi.string().custom(isValidObjectID).required()
})
