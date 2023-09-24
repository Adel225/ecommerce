import  jwt  from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import tokenModel from "../../database/models/token.model.js";
import userModel from "../../database/models/user.model.js";


const authinticate = asyncHandler(async (req,res,next) => {
    let token = req.headers.token;
    if (!token || !token.startsWith(process.env.TOKEN_BEARER)) return next(new Error("Invalid Token form" , {cause : 401}))
    
    token = token.split(process.env.TOKEN_BEARER)[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SEGNITURE);
    if (!decoded) {
        return next(new Error("Invalid Token",{cause : 401}))
    }

    const tokenDB = await tokenModel.findOne({token , isValid : true});
    if (!tokenDB) {
        return next(new Error("Token expired",{cause : 401}))
    }

    const user = await userModel.findOne({_id : decoded.id});
    if (!user) {
        return next(new Error("User not found",{cause : 401}))
    }
    req.user = user;
    return next()
})

export default authinticate;