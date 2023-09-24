import bcrypt,{ compareSync, hashSync } from "bcrypt";
import userModel from "../../../database/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import crypto from 'crypto'
import { sendEmail } from "../../utils/sendEmail.js";
import  jwt  from "jsonwebtoken";
import tokenModel from "../../../database/models/token.model.js";
import randomstring from "randomstring";
import cartModel from "../../../database/models/cart.model.js";


export const signup = asyncHandler(async (req,res,next) => {
    const {userName,email,password,cPassword,phone,gender} = req.body;
    const find = await userModel.findOne({"$or" : [{email} , {phone} , {userName}]});
    if (find?.email) {
        return next(new Error("Email exists !" , {cause : 401}))
    }
    if (find?.userName) {
        return next(new Error("Username exists !" , {cause : 401}))
    }
    if (find?.phone) {
        return next(new Error("phone exists !" , {cause : 401}))
    }
    if (password !== cPassword) {
        return next(new Error("password mismatched with cPassword"));
    }
    const hashPassword = hashSync(password , Number(process.env.SALT_ROUND))
    const activationCode = crypto.randomBytes(64).toString('hex');
    const createUser = await userModel.create({
        email,
        userName,
        password:hashPassword,
        phone,
        gender,
        activationCode
    })
    const link = `http://localhost:3000/auth/confirmEmail/${activationCode}`
    const sent = await sendEmail({
        to:email,
        subject: "Confirm your email",
        html: `<a href="${link}">Confirm your email</a>`
    })
    if (sent) {
        return res.status(201).json({
            success:true,
            status:201,
            message: "User created successfully , review your gmail",
            data: createUser
        })
    } else {
        return res.status(400).json({
            success:false,
            status:400,
            message: "Something went wrong"
        })
    }
})

export const activateAccount = asyncHandler(async (req,res,next) => {
    const {activationCode} = req.params;
    const user = await userModel.findOneAndUpdate({activationCode} , {
        isConfirmed : true,
        $unset : {activationCode: 1}
    });
    if (!user) {
        return next(new Error("Invalid activation code", {cause : 401}))
    }
    // add cart
    await cartModel.create({user : user._id});
    return res.json("your account has been activated successfully , login now!");
})

export const login = asyncHandler(async (req,res,next) => {
    const {email,phone,userName,password} = req.body;
    const find = await userModel.findOne({"$or" : [{email}, {phone}, {userName}]})
    if (!find) {
        return next(new Error("Invalid credentials", {cause:401}))
    }
    if (!find.isConfirmed) return next(new Error('Activate your account first!',{cause : 400}))
    const validPassowrd = bcrypt.compareSync(password,find.password);
    if (!validPassowrd) {
        return next(new Error("Invalid password!", {cause:401}))
    }
    const token = jwt.sign({ email: email , id: find._id }, process.env.TOKEN_SEGNITURE , { expiresIn: 60 * 60 * 24 * 30 } )
        // creating the token in the database
    Date.prototype.addDays = function(d) {
        this.setDate(this.getDay()+d);
        return this;
    }
    var later = new Date().addDays(30);
    const createTokenInDB = await tokenModel.create({
        token,
        user: find._id,
        expiredAt: later,
        agent : req.headers['user-agent']
    })
    console.log(createTokenInDB);
    find.status = 'online';
    await find.save();
    return res.json({success : true , token : token} )
})

export const forgetCode = asyncHandler(async (req,res,next) => {
    const user = await userModel.findOne({email : req.body.email})
    if (!user) {
        return next(new Error("Invalid Email!", {cause:401}))
    }
    const code = randomstring.generate({
        length: 6,
        charset: 'numeric'
    })
    await userModel.findOneAndUpdate({email : req.body.email} ,{forgetCode : code.toString()});
    const html = `
        <a href="http://localhost:3000/auth/resetPassword/${code}">Reset your password</a>
        <p>here is the code : ${code}</p>
    `;
    return (await sendEmail({
        to:user.email,
        subject: "Reset your password",
        html: html
    }) ? res.json({ success : true , msg : `check your email , here is the code : ${code}`}) 
       : next(new Error("something went wrong!")))
})

export const resetPassword = asyncHandler(async (req,res,next) => {
    const {email,newPassword,confirmNewPassword} = req.body;
    const {code} = req.params;
    
    if (newPassword !== confirmNewPassword) {
        return next(new Error("newPassword mismatched with confirmNewPassword", {cause : 401}))
    }
    const user = await userModel.findOne({forgetCode : code})
    if (!user) {
            return next(new Error("Invalid forget code", {cause:401}))
    }
    const match = compareSync(newPassword , user.password);
    if (match) {
        return next(new Error("New password cannot be same as old password", {cause:401}))
    }
    await userModel.findOneAndUpdate({email} , {$unset : {fogetCode : 1}});
    user.password = bcrypt.hashSync(newPassword , Number(process.env.SALT_ROUND))
    await user.save();

    const tokens = await tokenModel.find({user : user._id});
    tokens.forEach(async (token)=>{
        token.isValid = false;
        await token.save();
    })
    return res.send({success:true, msg:"you are all good now!"});
})
