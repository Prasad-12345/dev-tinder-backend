const express = require("express")
const {userAuth} = require("../middlewares/user")
const connectionRequest = require("../model/connectionRequest")
const User = require("../model/user")

const requestsRouter = express.Router()

requestsRouter.post("/request/send/:status/:userId", userAuth, async (req,res)=>{
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.userId
        const status = req.params.status

        const allowedStatus = ['interested', 'ignored']
        if(!allowedStatus.includes(status)){
            return res.json({
                message : "Invalid status type " + status
            })
        }

        const user = await User.findById(toUserId)
        if(!user){
            return res.status(400).json({
                message : "User does not exists"
            })
        }

        //to avoid duplicate connection request
        const existingConnectionRequest = await connectionRequest.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId : toUserId, toUserId : fromUserId}
            ]
        })

        if(existingConnectionRequest){
            return res.status(400).json({message:"Connection request already exists"})
        }

        const connectonRequest = new connectionRequest({
            fromUserId : fromUserId,
            toUserId : toUserId,
            status : status,
        })

        const data = await connectonRequest.save()
        res.json({
            message:req.user.firstName + ' ' + (status == 'interested' ? 'interested in' : status) + ' ' + user.firstName,
            data
        })
    }
    catch(err){
        return res.json({"Error" : err.message})
    }
})

requestsRouter.post('/request/review/:status/:requestId', userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user
        //validate status
        const allowedStatus = ['accepted', 'rejected']
        if(!allowedStatus.includes(req.params.status)){
            return res.status(400).json({message : "Status not allowed"})
        }

        const request = await connectionRequest.findOne({
            _id : req.params.requestId,
            toUserId : req.user._id,
            status : 'interested'
        })
        if(!request){
            return res.status(400).json({message : "Connection request not found"})
        }
        request.status = req.params.status
        const data = await request.save()
        return res.status(200).json({message : "Connection request " + req.params.status, data})
    }
    catch(err){
        return res.send("Error " + err.message)
    }
})

module.exports = requestsRouter