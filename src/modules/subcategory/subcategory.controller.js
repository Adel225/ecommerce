import categoryModel from "../../../database/models/category.model.js";
import subcategoryModel from "../../../database/models/sub-category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import slugify from 'slugify'
import cloudinary from '../../utils/cloudinary.js'


export const allSubcategories  = asyncHandler(async (req,res,next) => {
    const subcategories = await subcategoryModel.find().populate(
        {
            path : 'category',
            select : "name"
        },
        {
            path : "createdBy",
            select : "userName"
        }
    );
    return subcategories 
    ? res.status(200).json({success:true , result : subcategories}) 
    : next(new Error("something went wrong!" , {cause : 401}))
})

export const createSubcategory = asyncHandler(async (req,res,next) => {
    const { categoryID } = req.params;
    let  { name } = req.body;
    const findCategory = await categoryModel.findById(categoryID);
    if(!findCategory){
        return next(new Error("Category not found" , { cause : 404 }))
    }
    name = name.toLowerCase();
    const subcategoryExists = await subcategoryModel.findOne({name})
    if (subcategoryExists) {
        return next(new Error("Subcategory allready exists" , { cause : 403 }))
    }

    const { secure_url , public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {folder : `${process.env.FOLDER_CLOUD_NAME}/subCategory`}
    )

    const createSubcategory = await subcategoryModel.create({
        name,
        slug : slugify(name),
        category : categoryID,
        createdBy : req.user._id,
        image : {
            url : secure_url,
            id : public_id
        }
    })
    return res.status(201).json({success:true, msg : "subcategory created successfully!" ,result : createSubcategory});
})

export const updateSubcategory = asyncHandler(async (req,res,next) => {
    const { id , categoryID } = req.params;
    const { newName } = req.body;
    const subcategory = await subcategoryModel.findOne({_id : id , createdBy : req.user._id});
    if(!subcategory._id){
        return next(new Error("subcategory not found", { cause : 404 }))
    }
    if(!subcategory.createdBy){
        return next(new Error("you are not the creator!", { cause : 403 }))
    }
    const category = await categoryModel.findOne({_id : categoryID});
    if(!category){
        return next(new Error("category not found", { cause : 404 }))
    }

    subcategory.name = newName ? newName : subcategory.name;
    subcategory.slug = newName ? slugify(newName) : subcategory.slug;
    if (req.file) {
        const { secure_url , public_id } = cloudinary.uploader.upload(
            req.file.path,
            { public_id : subcategory.image.id }
        )
        subcategory.image.url = secure_url;
        subcategory.image.id = public_id
    }
    await subcategory.save();

    return res.status(200).json({success:true, msg : "subcategory updated successfully!",result : subcategory});
})

export const deleteSubcategory = asyncHandler(async (req,res,next) => {
    const { id , categoryID} = req.params;
    const category = await categoryModel.findOne({_id : categoryID});
    if(!category){
        return next(new Error("category not found", { cause : 404 }))
    }
    const subcategory = await subcategoryModel.find({_id : id , createdBy : req.user._id});
    if(!subcategory){
        return next(new Error("subcategory not found or you are not the creator!", { cause : 404 }))
    }
    const result = await cloudinary.uploader.destroy(subcategory.image.id)
    if (!result) {
        return next(new Error("something went wrong!", { cause : 401}))
    }
    const deletedSubcategory = await subcategoryModel.findByIdAndDelete(id);
    return res.status(200).json({success:true, msg : "subcategory deleted successfully!",result : deletedSubcategory});
})