import {Router} from "express"
import authinticate from "../../middleware/authintication.js";
import authorize from "../../middleware/athorization.js";
import isValid from "../../middleware/validation.js";
import * as cartController from './cart.controller.js'
import * as cartShemas from './cart.validation.js'

const router = Router();

router.post('/' , 
    authinticate,
    isValid(cartShemas.cart),
    cartController.addtocart
)

router.get('/', authinticate , cartController.userCart)

router.patch('/' , 
    authinticate,
    isValid(cartShemas.cart),
    cartController.updateCart
)

router.patch('/clear' , 
    authinticate,
    cartController.clearCart
)

router.patch('/:productId' , 
    authinticate,
    isValid(cartShemas.removeProductFromCart),
    cartController.removeProductFromCart
)

export default router