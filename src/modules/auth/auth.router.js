
import {Router} from "express"
import isValid from "../../middleware/validation.js"
import * as authValidationSchemas from './auth.validation.js'
import * as authController from './auth.controller.js'

const router = Router()

router.post("/signup",isValid(authValidationSchemas.signupSchema) , authController.signup)
router.get("/confirmEmail/:activationCode",isValid(authValidationSchemas.activateSchema) , authController.activateAccount)
router.post("/login",isValid(authValidationSchemas.loginSchema) , authController.login)
router.patch("/resetPassword/:code",isValid(authValidationSchemas.changePasswordSchema) , authController.resetPassword)
router.patch("/forgetCode" , isValid(authValidationSchemas.forgetCode) , authController.forgetCode)

export default router