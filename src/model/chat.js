const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
    text : {
        type : String,
        required : true
    }
})

const chatSchema = mongoose.Schema({
    participants : [
        {type : mongoose.Schema.Types.ObjectId, ref:"User", required:true}
    ],
    messages : [
        messageSchema
    ]
})

module.exports = mongoose.model("Chat", chatSchema)