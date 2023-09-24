import joi from 'joi'
import {isValidObjectID} from '../category/category.validation.js'

export const cart = joi.object({
    productId : joi.string().custom(isValidObjectID).required(),
    quantity : joi.number().integer().min(1).required()
}).required();

export const removeProductFromCart = joi.object({
    productId : joi.string().custom(isValidObjectID).required(),
}).required();