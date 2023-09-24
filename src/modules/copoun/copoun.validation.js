import joi from "joi"

export const createCopoun =  joi.object({
    discount : joi.number().min(0).max(100).required(),
    expires : joi.date().greater(Date.now()).required()
}).required()

export const updateCopoun =  joi.object({
    discount : joi.number().min(0).max(100),
    expires : joi.date().greater(Date.now()),
    code : joi.string().length(5).required()
}).required()


export const deleteCopoun =  joi.object({
    code : joi.string().length(5).required()
}).required()