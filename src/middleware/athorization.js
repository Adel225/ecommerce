import { asyncHandler } from "../utils/asyncHandler.js"


const authorize = (role) => {
    return asyncHandler(async (req,res,next) => {
        if (role !== req.user.role) {
            return next(new Error('User not authorized' , {cause : 403}))
        }
        return next()
    })
}

export default authorize