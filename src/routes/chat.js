const express = require("express")
const { userAuth } = require("../middlewares/user")
const Chat = require("../model/chat")
const chatRouter = express.Router()

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res)=>{
    const {targetUserId} = req.params
    const userId = req.user._id
    try{
        let chat = await Chat.findOne({participants : {$all : [userId, targetUserId]}}).populate("messages.senderId", "firstName lastName")
        if(!chat){
            chat = new Chat({
                participants : [userId, targetUserId],
                messages : []
            })
            await chat.save()
        }
        return res.status(200).json({chat})
    }
    catch(err){
        return res.status(500).json({err})
    }
})

module.exports = chatRouter