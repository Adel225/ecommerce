import pkg from 'voucher-code-generator';
import { asyncHandler } from "../../utils/asyncHandler.js";
import copounModel from "../../../database/models/copoun.model.js"

export const createCopoun = asyncHandler(async (req,res,next) => {
    const code  = pkg.generate({length : 5 , count : 1});
    const copoun = await copounModel.create({
        code : code[0],
        createdBy : req.user._id,
        expires : new Date(req.body.expires).getTime(),
        discount : req.body.discount
    });
    return res.json({success: true, msg: "copoun craeted successfully" , copoun})
})

export const updateCopoun = asyncHandler(async (req,res,next) => {
    const copoun = await copounModel.findOne({
        code : req.params.code , 
        expires : { $gt : Date.now() }
    });
    if (!copoun) return next(new Error("Invalid code" , {cause : 401}))

    copoun.discount = req.body.discount ? req.body.discount : copoun.discount
    copoun.expires = req.body.expires ? new Date(req.body.expires).getTime() : copoun.expires
    await copoun.save();
    return res.json({success: true, msg: "copoun updated successfully" , copoun})
});

export const deleteCopoun = asyncHandler(async (req,res,next) => {
    const copoun = await copounModel.findOne({
        code : req.params.code,
    });
    if (!copoun) return next(new Error("Invalid code" , {cause : 401}))
    if (req.user.id !== copoun.createdBy.toString()) return next(new Error("you are not the owner" , {cause : 403}))
    await copounModel.findOneAndDelete({code : req.params.code});
    return res.json({success : true, msg: "copoun deleted successfully!"})
})

export const allCopouns = asyncHandler(async (req,res,next) => {
    const copouns = await copounModel.find();
    return res.json({success:true, results : copouns})
})