import {Router} from "express"
import * as subbrandController from "./subbrand.controller.js"
import * as subbrandShemas from "./subbrand.validation.js"
import authinticate from '../../middleware/authintication.js'
import authorize from '../../middleware/athorization.js'
import isValid from '../../middleware/validation.js'
import { filterObject,fileUpload } from '../../utils/multer.js'

const router = Router({mergeParams : true})

router.get('/', subbrandController.allSubbrands);

router.post('/create',
    authinticate,
    authorize("admin"),
    fileUpload(filterObject.image).single("subbrand"),
    isValid(subbrandShemas.createSubbrand),
    subbrandController.createSubbrand
)

router.patch('/:id',
    authinticate,
    authorize("admin"),
    fileUpload(filterObject.image).single("subbrand"),
    isValid(subbrandShemas.updateSubbrand),
    subbrandController.updateSubbrand
);

router.delete('/:id',
    authinticate,
    authorize("admin"),
    isValid(subbrandShemas.deleteSubbrand),
    subbrandController.deleteSubbrand
)

export default router
