const mongoose = require("mongoose")

const PaymentSchema = mongoose.Schema({
    paymentId:{
        type:String,
    },
    orderId : {
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        required:true
    },
    amount : {
        type:Number,
        required:true
    },
    currency : {
        type:String,
        required:true
    },
    receipt : {
        type:String,
        required:true
    },
    notes : {
        firstName:{
            type:String
        },
        lastName:{
            type:String
        },
        emailId:{
            type:String
        },
    },
}, {
    timestamps:true
})

module.exports = mongoose.model("Payment", PaymentSchema)