import multer,{diskStorage} from "multer";

export const filterObject = {
    image : ["image/jpeg", "image/png", "image/jpg"],
    pdf : ["application/pdf"],
    video : ['video/mp4']
} 

export const fileUpload = (filterArray) => {
    const fileFilter = (req,file,cb) => {
        if(filterArray.includes(file.mimetype)){
            cb(null,true)
        } else {
            return cb(`${file.mimetype} is not supported`, false);
        }
    };
    return multer({ storage : diskStorage({}) , fileFilter })
}