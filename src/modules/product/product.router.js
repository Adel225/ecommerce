import {Router} from 'express'
import * as productController from "./product.controller.js" 
import * as productSchemas from "./product.validation.js" 
import authinticate from "../../middleware/authintication.js";
import authorize from "../../middleware/athorization.js";
import isValid from "../../middleware/validation.js";
import { fileUpload, filterObject } from "../../utils/multer.js";

const router = Router({mergeParams : true});

router.post('/',
    authinticate,
    authorize("admin"),
    fileUpload(filterObject.image).fields([
        {name : "imageCover" , maxCount : 1 },
        {name : "images" , maxCount : 3 }
    ]),
    isValid(productSchemas.createProductSchema.body),
    productController.createProduct
);

router.delete('/:id',
    authinticate,
    authorize("admin"),
    isValid(productSchemas.productIdSchema),
    productController.deleteProduct
);

router.get('/' , productController.allProducts);

router.get('/single/:productId' ,
    isValid(productSchemas.productIdSchema.params), 
    productController.singleProduct
);



export default router