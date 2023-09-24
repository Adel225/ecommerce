import { asyncHandler } from "../../utils/asyncHandler.js";
import {nanoid} from 'nanoid'
import cloudinary from '../../utils/cloudinary.js'
import productModel from "../../../database/models/product.model.js";
import categoryModel from '../../../database/models/category.model.js'
import subcategoryModel from '../../../database/models/sub-category.model.js'
import brandModel from '../../../database/models/brand.model.js'


export const createProduct = asyncHandler(async (req,res,next) => {
    if (!req.files) {
        return next(new Error("product images are required !" , {cause : 400}));
    }
    const findproduct = await productModel.findOne({title : req.body.title});
    if (findproduct) {
        return next(new Error("product with this title exists !" , {cause : 401}));
    }
    // check category id , brand id and subcategory id
    console.log(req.body.category);
    const checkCategory = await categoryModel.findById(req.body.category);
    const checkSubCategory = await subcategoryModel.findById(req.body.subcategory);
    const checkBrand = await brandModel.findById(req.body.brand);
    if (!checkBrand || !checkCategory || !checkSubCategory) {
        return next(new Error("category or brand or subcategory does not exist!" , {cause : 401}));
    }

    const uniqueFolderName = nanoid();
    let imagesArr = [];
    for (const file of req.files.images) {
        const {secure_url , public_id} = await cloudinary.uploader.upload(
            file.path,
            {folder : `${process.env.FOLDER_CLOUD_NAME}/products/${uniqueFolderName}`}
        )
        imagesArr.push({ url : secure_url, id : public_id});
    }
    const {secure_url , public_id} = await cloudinary.uploader.upload(
        req.files.imageCover[0].path,
        {folder : `${process.env.FOLDER_CLOUD_NAME}/products/${uniqueFolderName}`}
    )
    const product = await productModel.create({
        ...req.body,
        cloudFolder : uniqueFolderName,
        createdBy : req.user._id,
        imageCover : {url : secure_url, id : public_id},
        images : imagesArr
    });
    return res.status(200).json({success:true, msg : "product created successfully !" , result : product })
});

export const deleteProduct = asyncHandler(async (req,res,next) => {
    const product = await productModel.findById(req.params.id);
    if (!product) {
        return next(new Error("product not found!", { cause : 404 }))
    }
    if (req.user._id.toString() != product.createdBy.toString()) {
        return next(new Error("not authorized!", { cause : 403 }))
    }
    const ImagesArr = product.images;
    const ids = ImagesArr.map((imageObject) => imageObject.id);
    ids.push(product.imageCover.id);

    await cloudinary.api.delete_resources(ids);
    await cloudinary.api.delete_folder(`${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`);
    await productModel.findByIdAndDelete(req.params.id);
    return res.json({success : true , msg : "product deleted successfully"})
})

export const allProducts = asyncHandler(async (req,res,next) =>{
    if (req.params.categoryID) {
        const products = await productModel.find({category : req.params.categoryID});
        return res.json({success : true , products})
    }
    let {page,fields,sort} = req.query;
    const products = await productModel.find({...req.query})
        .paginate(page)
        .customSelect(fields)
        .sort(sort);
    return res.json({success : true, products})
})

export const singleProduct = asyncHandler(async (req,res,next) => {
    const product = await productModel.findById(req.params.productId);
    if(!product) return next(new Error("product not found!", { cause : 404 }))
    return res.json({success:true, product})
})

