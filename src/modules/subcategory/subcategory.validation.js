import joi from "joi"
import { Types } from "mongoose";

const isValidObjectID = (value , helper) => {
    return Types.ObjectId.isValid(value) 
    ? true 
    : helper.message("Invalid objectID!");
}

export const createSubcategory = joi.object({
    name: joi.string().min(3).required(),
    categoryID : joi.string().custom(isValidObjectID).required()
})

export const updateSubcategory = joi.object({
    newName: joi.string().min(3),
    id: joi.string().custom(isValidObjectID).required(),
    categoryID : joi.string().custom(isValidObjectID).required()
})

export const deleteSubcategory = joi.object({
    id: joi.string().custom(isValidObjectID).required(),
    categoryID : joi.string().custom(isValidObjectID).required()
})