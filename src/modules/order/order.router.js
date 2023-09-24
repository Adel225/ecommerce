import { Router } from "express"
import * as orderController from "./order.controller.js" 
import * as orderSchemas from "./order.validation.js" 
import authinticate from "../../middleware/authintication.js";
import authorize from "../../middleware/athorization.js";
import isValid from "../../middleware/validation.js";

const router = Router();

router.post("/" , 
    authinticate, 
    isValid(orderSchemas.createOrder), 
    orderController.createOrder
)

router.patch("/:orderId" , 
    authinticate, 
    isValid(orderSchemas.cancelOrder) , 
    orderController.cancelOrder
)

///          webhook             ///


router.post('/webhook', 
    express.raw({type: 'application/json'}), 
    orderController.orderWebhook
    );


export default router