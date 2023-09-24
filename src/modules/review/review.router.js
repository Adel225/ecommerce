import {Router} from "express"
import {addReview} from "./review.controller.js"
import authinticate from "../../middleware/authintication.js"

const router = Router({mergeParams : true})

router.post('/',
    authinticate,
    addReview
)

export default router