import brandModel from "../../../database/models/brand.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from '../../utils/cloudinary.js'
import slugify from "slugify"


export const createBrand = asyncHandler(async (req,res,next) => {
    const {name} = req.body;

    if (!req.file) {
        return next(new Error("brand logo is reuired"))
    }
    const {secure_url , public_id} = await cloudinary.uploader.upload(
        req.file.path,
        {folder : `${process.env.FOLDER_CLOUD_NAME}/brand`}
    )
    const brand = await brandModel.create({
        name,
        logo: { url : secure_url ,  id : public_id },
        createdBy : req.user._id,
        slug : slugify(name)
    })
    return res.status(201).json({success : true , msg : "brand created successfully" , result : brand})
});

export const updatebrand = asyncHandler(async (req,res,next) => {
    const {newName} = req.body;
    const {brandID} = req.params;

    const brand = await brandModel.findOne({_id : brandID , createdBy : req.user._id});
    if (!brand._id) {
        return res.status(404).json({success : false, msg : "brand not found!"})
    }
    if (!brand.createdBy) {
        return res.status(403).json({success : false, msg : "you are not the createor!"})
    }

    brand.name = newName ? newName : brand.name;
    brand.slug = newName ? slugify(newName) : brand.slug;

    if (req.file) {
        const {secure_url, public_id} = await cloudinary.uploader.upload(
            req.file.path,
            {
                public_id : brand.logo.id
            }
        )
        brand.logo.url = secure_url;
    };
    await brand.save();
    return res.status(200).json({success:true , msg : "brand updated successfully" , result : brand})
});

export const deleteBrand = asyncHandler(async (req,res,next) => {
    const brand = await brandModel.findByIdAndDelete(req.params.brandID);
    if (!brand) {
        return res.status(404).json({success : false, msg : "brand not found"})
    }

    const result = await cloudinary.uploader.destroy(brand.logo.id);
    if (!result) {
        return next(new Error("something went wrong!", { cause : 401}))
    }
    await brandModel.deleteOne({_id : id})
    return res.status(200).json({success: true , msg : "brand deleted successfully" })
});

export const getAllBrands = asyncHandler(async (req,res,next) => {
    const brands = await brandModel.find().populate({
        path : "subbrand",
        select : "name",
        populate : [{
            path : "createdBy",
            select : "userName"
        }]
    })
    res.status(200).json({success : true , result : brands})
})