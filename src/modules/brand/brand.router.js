import {Router} from "express"
import * as brandController from './brand.controller.js'
import * as brandShemas from './brand.validation.js'
import authinticate from "../../middleware/authintication.js";
import authorize from "../../middleware/athorization.js";
import isValid from "../../middleware/validation.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import subbrandRouter from "../subbrand/subbrand.router.js"

const router = Router();

router.use("/:brandID/subbrand" , subbrandRouter);

router.post("/" , 
    authinticate,
    authorize("admin"),
    fileUpload(filterObject.image).single("brand"),
    isValid(brandShemas.createBrand),
    brandController.createBrand
    );

router.patch('/:brandID' ,
    authinticate,
    authorize("admin"),
    fileUpload(filterObject.image).single("brand"),
    isValid(brandShemas.updateBrand), 
    brandController.updatebrand
    );

router.delete('/:brandID' ,
    authinticate,
    authorize("admin"),
    isValid(brandShemas.deleteBrand),
    brandController.deleteBrand
    );

router.get('/' , brandController.getAllBrands)

export default router