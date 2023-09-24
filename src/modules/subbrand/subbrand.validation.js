import joi from "joi"
import { Types } from "mongoose";

const isValidObjectID = (value , helper) => {
    return Types.ObjectId.isValid(value) 
    ? true 
    : helper.message("Invalid objectID!");
}

export const createSubbrand = joi.object({
    name: joi.string().min(3).required(),
    brandID : joi.string().custom(isValidObjectID).required()
})

export const updateSubbrand = joi.object({
    newName: joi.string().min(3),
    id: joi.string().custom(isValidObjectID).required(),
    brandID : joi.string().custom(isValidObjectID).required()
})

export const deleteSubbrand = joi.object({
    id: joi.string().custom(isValidObjectID).required(),
    brandID : joi.string().custom(isValidObjectID).required()
})