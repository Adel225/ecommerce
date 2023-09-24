import {Router} from "express"
import * as subcategoryController from "./subcategory.controller.js"
import * as subcategoryShemas from "./subcategory.validation.js"
import authinticate from '../../middleware/authintication.js'
import authorize from '../../middleware/athorization.js'
import isValid from '../../middleware/validation.js'
import { filterObject,fileUpload } from '../../utils/multer.js'

const router = Router({mergeParams : true})

router.get('/', subcategoryController.allSubcategories)

router.post('/create',
    authinticate,
    authorize("admin"),
    fileUpload(filterObject.image).single("subcategory"),
    isValid(subcategoryShemas.createSubcategory),
    subcategoryController.createSubcategory
)

router.patch('/:id',
    authinticate,
    authorize("admin"),
    fileUpload(filterObject.image).single("subcategory"),
    isValid(subcategoryShemas.updateSubcategory),
    subcategoryController.updateSubcategory
);

router.delete('/:id',
    authinticate,
    authorize("admin"),
    isValid(subcategoryShemas.deleteSubcategory),
    subcategoryController.deleteSubcategory
)

export default router