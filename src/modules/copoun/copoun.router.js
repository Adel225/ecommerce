import {Router} from "express"
import * as copounController from './copoun.controller.js'
import * as copounShemas from './copoun.validation.js'
import authinticate from "../../middleware/authintication.js";
import authorize from "../../middleware/athorization.js";
import isValid from "../../middleware/validation.js";

const router = Router();


router.post("/" , 
    authinticate , 
    authorize("admin"), 
    isValid(copounShemas.createCopoun),
    copounController.createCopoun
)

router.patch("/:code" , 
    authinticate , 
    authorize("admin"), 
    isValid(copounShemas.updateCopoun),
    copounController.updateCopoun
)

router.delete("/:code" , 
    authinticate , 
    authorize("admin"), 
    isValid(copounShemas.deleteCopoun),
    copounController.deleteCopoun
)

router.get("/", copounController.allCopouns)

export default router