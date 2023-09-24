import { asyncHandler } from "../../utils/asyncHandler.js";
import cartModel from '../../../database/models/cart.model.js'
import copounModel from '../../../database/models/copoun.model.js'
import productModel from '../../../database/models/product.model.js'
import orderModel from "../../../database/models/order.model.js";
import { createInvoice } from "../../utils/createInvoice.js";
import cloudinary from "../../utils/cloudinary.js"
import {sendEmail} from "../../utils/sendEmail.js"
import path from "path"
import {fileURLToPath} from 'url'
import { clearCart, updateSock } from "./order.services.js";
import Stripe from "stripe";
const __dirname = path.dirname(fileURLToPath(import.meta.url));


export const createOrder = asyncHandler(async (req,res,next) => {
    //data
    const { payment, address, copoun, phone } = req.body;

    // check copoun
    let checkCopoun;
    if (copoun) {
        checkCopoun = await copounModel.findOne({
            code : copoun, 
            expires : {$gt : Date.now()}
        });
        if(!checkCopoun) return next(new Error("Invalid copoun"))
    }

    // check cart
    const cart = await cartModel.findOne({user : req.user._id});
    const products = cart.products;
    if (products.length < 1) return next(new Error("Empty cart!"));

    let orderProducts = [];
    let orderPrice = 0;
    // check products
    for (let i = 0; i < products.length; i++) {
        const product = await productModel.findById(products[i].productId);
        if(!product) 
            return next(new Error(`product ${products[i].productId} not fount`))
        if(!product.inStock(products[i].quantity)) 
            return next(new Error(`${product.title} is out of stock`))
        orderProducts.push({
            productId : product._id,
            quantity : products[i].quantity,
            name : product.title,
            itemPrice : product.finalPrice,
            totalPrice : products[i].quantity * product.finalPrice
        });
        orderPrice += products[i].quantity * product.finalPrice;
    }

    //create order
    const order = await orderModel.create({
        user: req.user._id,
        products : orderProducts,
        address,
        phone,
        copoun : {
            id : checkCopoun?._id,
            code : checkCopoun?.code,
            discount : checkCopoun?.discount
        },
        payment,
        price : orderPrice,
    })

    // generate invoice 
    const user = req.user;
    const invoice = {
        shipping : {
            name : user.userName,
            address : order.address,
            country : "Egypt"
        },
        items : order.products,
        subtotal : order.price,
        paid : order.finalPrice,
        invoice_nr : order._id
    }
    const pdfpath = path.join(
        __dirname,
        `../../../invoiceTemps/${order._id}.pdf`
    )
    createInvoice(invoice, pdfpath)

    // upload on cloudinary
    const {secure_url, public_id} = await cloudinary.uploader.upload(pdfpath, {
        folder : `${process.env.FOLDER_CLOUD_NAME}/order/invoice/${user._id}`
    })

    // add invoice to order
    order.invoice = {id : public_id, url : secure_url};
    await order.save();

    let message = {
        attachments : [
            {
                path : secure_url,
                contentType : "application/pdf"
            },
        ]
    }
    // send email
    const isSent = await sendEmail({
        to : user.email, 
        subject : "Order invoice" , 
        attachments : message,
    })
    if (isSent) {
        // update stock
        updateSock(order.products, true)
        // clear cart
        clearCart(user._id)
    }
    // payment 
    if (payment == "visa") {
        const stripe = new Stripe(process.env.STRIPE_KEY);

    let existCopoun;
    if(order.copoun.name !== undefined) {
        existCopoun = await stripe.coupons.create({
            percent_off : order.copoun.discount,
            duration : "once"
        })
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        metadata : {
            order_id : order._id.toString()
        },
        success_url : process.env.SUCCESS_URL,
        cancel_url : process.env.CANCEL_URL,
        line_items : order.products.map((product) => {
            return {
                price : {
                    currency : "egp",
                    product : {
                        name: product.title,
                    },
                    unit_amount : product.itemPrice * 100,
                },
                quantity : product.quantity
            }
        }),
        discounts: existCopoun ? [{coupon : existCopoun.id}] : [],
    })
    return res.json({seccess:true, results : session.url})
}

    return res.json({success:true, msg:"order placed successfully" , })
});

export const cancelOrder = asyncHandler(async (req,res,next) => {
    const {orderId} = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) return next(new Error("order not found" , {cause : 404}));
    if (order.status === "shipped" || order.status === "delivered") {
        return next(new Error("cannot cancel order now"));
    }
    order.status = "canceled"
    await order.save();
    updateSock(order.products, false);
    return res.json({success:true, msg:"order canceled successfully",})
});
   
///     webhook       ///

export const orderWebhook = asyncHandler(async (request, response) => {
     const sig = request.headers['stripe-signature'];
     const stripe = new Stripe(process.env.STRIPE_KEY);
        let event;
        try {
            event = stripe.webhooks.constructEvent(request.body, sig, process.env.ENDPOINT_SECRET);
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

// Handle the event
            const orderId = event.data.object.metadata.order_id;    
            if (event.type === "checkout.session.completed") {
                await orderModel.findOneAndUpdate({_id : orderId} , {status : "visa paied"});
                // update stock 
                // clear cart 
                return ;
            }
            await orderModel.findOneAndUpdate({_id : orderId} , {status : "failed to pay"});
            return ;

})

/// TODO : split the create order endpoint into two endpoints : { cash pay , visa pay }
/// TODO : move the clear cart and update stock functions from create order endpoint => webhook at line 187  