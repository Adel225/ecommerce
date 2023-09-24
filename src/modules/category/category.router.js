import {Router} from "express"
import * as categoryController from './category.controller.js'
import * as categoryShemas from './category.validation.js'
import authinticate from "../../middleware/authintication.js";
import authorize from "../../middleware/athorization.js";
import isValid from "../../middleware/validation.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import subCategoryRouter from "../subcategory/subcategory.router.js"
import productRouter from "../product/product.router.js"

const router = Router()

router.use('/:categoryID/subCategory' , subCategoryRouter)
router.use('/:categoryID/products' , productRouter)

router.post('/' ,
    authinticate,
    authorize("admin"),
    fileUpload(filterObject.image).single("category"),
    isValid(categoryShemas.createCategorySchema), 
    categoryController.createCategory
    );

router.patch('/:categoryID' ,
    authinticate,
    authorize("admin"),
    fileUpload(filterObject.image).single("category"),
    isValid(categoryShemas.updateCategorySchema), 
    categoryController.updateCategory
    );

router.delete('/:categoryID' ,
    authinticate,
    authorize("admin"),
    isValid(categoryShemas.deleteCategory),
    categoryController.deleteCategory
    );

router.get('/' , categoryController.getAllCategories)

export default router