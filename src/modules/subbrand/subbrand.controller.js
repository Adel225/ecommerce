import brandModel from "../../../database/models/brand.model.js";
import subbrandModel from "../../../database/models/subbrand.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import slugify from 'slugify'
import cloudinary from '../../utils/cloudinary.js'

export const allSubbrands  = asyncHandler(async (req,res,next) => {
    const subbrands = await subbrandModel.find().populate(
        {
            path : 'brand',
            select : "name"
        },
        {
            path : "createdBy",
            select : "userName"
        }
    );
    return subcategories 
    ? res.status(200).json({success:true , result : subbrands}) 
    : next(new Error("something went wrong!" , {cause : 401}))
});

export const createSubbrand = asyncHandler(async (req,res,next) => {
    const { brandID } = req.params;
    let  { name } = req.body;
    const findBrand = await brandModel.findById(brandID);
    if(!findBrand){
        return next(new Error("Brand not found" , { cause : 404 }))
    }
    name = name.toLowerCase();
    const subbrandExists = await subbrandModel.findOne({name})
    if (subbrandExists) {
        return next(new Error("Subbrand allready exists" , { cause : 403 }))
    }

    const { secure_url , public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {folder : `${process.env.FOLDER_CLOUD_NAME}/brand/subbrand`}
    )

    const createSubbrand = await subbrandModel.create({
        name,
        slug : slugify(name),
        brand : brandID,
        createdBy : req.user._id,
        logo : {
            url : secure_url,
            id : public_id
        }
    })
    return res.status(201).json({success:true, msg : "subbrand created successfully!" ,result : createSubbrand});
});

export const updateSubbrand = asyncHandler(async (req,res,next) => {
    const { id , brandID } = req.params;
    const { newName } = req.body;
    const subbrand = await subbrandModel.findOne({_id : id , createdBy : req.user._id});
    if(!subbrand._id){
        return next(new Error("subbrand not found", { cause : 404 }))
    }
    if(!subbrand.createdBy){
        return next(new Error("you are not the creator!", { cause : 403 }))
    }
    const brand = await brandModel.findOne({_id : brandID});
    if(!brand){
        return next(new Error("Brand not found", { cause : 404 }))
    }

    subbrand.name = newName ? newName : subbrand.name;
    subbrand.slug = newName ? slugify(newName) : subbrand.slug;
    if (req.file) {
        const { secure_url , public_id } = cloudinary.uploader.upload(
            req.file.path,
            { public_id : subbrand.image.id }
        )
        subbrand.logo.url = secure_url;
        subbrand.logo.id = public_id
    }
    await subbrand.save();

    return res.status(200).json({success:true, msg : "subbrand updated successfully!",result : subbrand});
});

export const deleteSubbrand = asyncHandler(async (req,res,next) => {
    const { id , brandID} = req.params;
    const brand = await brandModel.findOne({_id : brandID});
    if(!brand){
        return next(new Error("brand not found", { cause : 404 }))
    }
    const subbrand = await subbrandModel.find({_id : id , createdBy : req.user._id});
    if(!subbrand){
        return next(new Error("subbrand not found or you are not the creator!", { cause : 404 }))
    }
    const result = await cloudinary.uploader.destroy(subbrand.image.id)
    if (!result) {
        return next(new Error("something went wrong!", { cause : 401}))
    }
    const deletedSubbrand = await subbrandModel.findByIdAndDelete(id);
    return res.status(200).json({success:true, msg : "subbrand deleted successfully!",result : deletedSubbrand});
})