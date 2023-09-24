import authRouter from './modules/auth/auth.router.js'
import categoryRouter from './modules/category/category.router.js'
import brandRouter from './modules/brand/brand.router.js'
import productRouter from './modules/product/product.router.js'
import copounRouter from './modules/copoun/copoun.router.js'
import cartRouter from './modules/cart/cart.router.js'
import orderRouter from './modules/order/order.router.js'
import reviewRouter from './modules/review/review.router.js'
import morgan from 'morgan'
import cors from 'cors'

const bootstrab = (app,express) => {

    app.use(morgan("dev"));
    // CORS
    const whitelist = ["http://127.0.0.1:5500"]
    // app.use((req,res,next) => {
    //     console.log(req.originalUrl);
    //     if (req.originalUrl.includes("/auth/confirmEmail")) {
    //         res.setHeaders("Access-Control-Allow-Origin" ,"*")
    //         res.setHeaders("Access-Control-Allow-Methods" ,"GET")
    //         return next()
    //     }
    //     // if (!whitelist.includes(req.header("origin"))) {
    //     //     return next(new Error("Blocked by CORS"));
    //     // }
    //     res.setHeaders("Access-Control-Allow-Origin" ,"*")
    //     res.setHeaders("Access-Control-Allow-Methods" ,"*")
    //     res.setHeaders("Access-Control-Allow-Headers" ,"*")
    //     res.setHeaders("Access-Control-Allow-Private-Network" ,true)
    //     return next()
    // })
    app.use(cors())
    
    app.use((req,res,next) => {
        if (req.originalUrl === "/order/webhook") {
            return next()
        }
        express.json()(req,res,next);
    })

    app.use(express.urlencoded({ extended: false }));

    app.use("/auth" , authRouter);
    app.use("/category" , categoryRouter);
    app.use("/brand" , brandRouter);
    app.use("/product" , productRouter);
    app.use("/copoun" , copounRouter);
    app.use("/cart" , cartRouter);
    app.use("/order" , orderRouter);
    app.use("/review" , reviewRouter);

    app.all("*" , (req,res,next) => {
        return next(new Error("page not found" , {cause : 404}))
    })

    app.use((err,req,res,next) => {
        return res.status(err.status || 500).json({
            success : false,
            message : err.message,
            cause : err.cause,
            stack : err.stack
        })
    })
}

export default bootstrab