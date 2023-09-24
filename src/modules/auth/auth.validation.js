import joi from "joi"

export const signupSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    cPassword : joi.string().valid(joi.ref("password")).required(),
    userName:joi.string().min(5).max(20).required(),
    gender : joi.string(),
    phone:joi.string().min(10).max(10).required()
}).required()

export const activateSchema = joi.object({
    activationCode:joi.string().required()
}).required()

export const loginSchema = joi.object({
    email: joi.string().email(),
    userName:joi.string().min(5).max(20),
    phone:joi.string().min(10).max(10),
    password: joi.string().min(8).required()
}).required()

export const forgetCode = joi.object({
    email: joi.string().email().required()
}).required()

export const changePasswordSchema = joi.object({
    email: joi.string().email().required(),
    code : joi.string().required(),
    newPassword: joi.string().min(8).required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required()
}).required()
