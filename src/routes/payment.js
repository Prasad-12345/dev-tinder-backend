const express = require("express");
const { userAuth } = require("../middlewares/user");
const razorPayInstance = require("../../utils/razorpay");
const Payment = require("../model/payment");
const MEMBERSHIP_AMOUNT = require("../../utils/constants");
const crypto = require("crypto");
const {validateWebhookSignature} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../model/user");

const paymentRouer = express.Router();

paymentRouer.post("/payment/create", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const receiptId = crypto.randomInt(100000, 1000000).toString();
    const order = await razorPayInstance.orders.create({
      amount: MEMBERSHIP_AMOUNT,
      currency: "INR",
      receipt: receiptId,
      notes: {
        firstName: loggedInuser?.firstName,
        lastName: loggedInuser?.lastName,
        emailId: loggedInuser?.emailId,
      },
    });

    const payment = new Payment({
      orderId: order?.id,
      userId: req?.user?._id,
      status: order?.status,
      amount: order?.amount,
      currency: order?.currency,
      receipt: order?.receipt,
      notes: order?.notes,
    });

    await payment.save();

    return res.json({
      message: "order generated successfully",
      keyId: process.env.razorpay_test_key_id,
      payment,
    });
  } catch (err) {
    return res.json({ err });
  }
});

paymentRouer.post("/payment/webhook", async (req, res) => {
  try {
    const webHookSignature = req.headers["x-razorpay-signature"]
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webHookSignature,
      process.env.razorpay_webhook_secret
    );
    if(!isWebhookValid){
        return res.json({message:"webhook is invalid"})
    }

    const paymentDetails = req.body.payload.payment.entity
    const payment = await Payment.findOne({orderId:paymentDetails.order_id})
    payment.status = paymentDetails.status
    await payment.save()
    const user = await User.findOne(payment.userId)
    user.isPremium = true
    await user.save()
    // if(req.body.event == 'payment.captured'){

    // }
    // if(req.body.event == 'payment.failed'){
        
    // }
    return res.status(200).json({message:"Webhook received successfully"})
  } catch (err) {
    console.log(err);
    return res.status(500).json({err})
  }
});

paymentRouer.get('/premium/verify', userAuth, async (req, res)=>{
    if(req.user.isPremium){
        return res.json({isPremium : true})
    }
    return res.json({isPremium : false})
})
module.exports = paymentRouer;
