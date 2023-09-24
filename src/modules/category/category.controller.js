import categoryModel from "../../../database/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from '../../utils/cloudinary.js'
import slugify from "slugify"


export const createCategory = asyncHandler(async (req,res,next) => {
    const {name} = req.body;

    if (!req.file) {
        return next(new Error("Category image is reuired"))
    }
    const {secure_url , public_id} = await cloudinary.uploader.upload(
        req.file.path,
        {folder : `${process.env.FOLDER_CLOUD_NAME}/category`}
    )
    const category = await categoryModel.create({
        name,
        image: { url : secure_url ,  id : public_id },
        createdBy : req.user._id,
        slug : slugify(name)
    })
    return res.status(201).json({success : true , msg : "category created successfully" , result : category})
})

export const updateCategory = asyncHandler(async (req,res,next) => {
    const {newName} = req.body;
    const {categoryID} = req.params

    const category = await categoryModel.findOne({_id : categoryID , createdBy : req.user._id});
    if (!category._id) {
        return res.status(404).json({success : false, msg : "category not found!"})
    }
    if (!category.createdBy) {
        return res.status(403).json({success : false, msg : "you are not the createor!"})
    }

    category.name = newName ? newName : category.name;
    category.slug = newName ? slugify(newName) : category.slug;

    if (req.file) {
        const {secure_url, public_id} = await cloudinary.uploader.upload(
            req.file.path,
            {
                public_id : category.image.id
            }
        )
        category.image.url = secure_url;
    };
    await category.save();
    return res.status(200).json({success:true , msg : "category updated successfully" , result : category})
});

export const deleteCategory = asyncHandler(async (req,res,next) => {
    const category = await categoryModel.findByIdAndDelete(req.params.categoryID);
    if (!category) {
        return res.status(404).json({success : false, msg : "category not found"})
    }

    const result = await cloudinary.uploader.destroy(category.image.id);
    if (!result) {
        return next(new Error("something went wrong!", { cause : 401}))
    }
    await categoryModel.deleteOne({_id : id})
    return res.status(200).json({success: true , msg : "category deleted successfully" })
});

export const getAllCategories = asyncHandler(async (req,res,next) => {
    const categories = await categoryModel.find().populate({
        path : "subcategory",
        select : "name",
        populate : [{
            path : "createdBy",
            select : "userName"
        }]
    });
    return res.status(200).json({success:true, msg : "categories fetched successfully", result : categories})
})