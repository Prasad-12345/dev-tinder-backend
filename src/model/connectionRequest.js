const mongoose = require("mongoose")

const connectionRequestSchema = mongoose.Schema({
    fromUserId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require: true
    },
    toUserId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        require: true
    },
    status : {
        type : String,
        enum : {
            values : ["interested", "ignored", "accepted", "rejected"],
            message: '{VALUE} is not supported'
        },
        require: true
    }
}, {
    timestamps:true
})

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Can not send connecton request to yourself")
    }
    next()
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema)