const express = require('express')
const { userAuth } = require('../middlewares/user')
const connectionRequest = require('../model/connectionRequest')
const User = require('../model/user')

const userRouter = express.Router()

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

//get all pending connection request for logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user
        const pendingRequest = await connectionRequest.find({
            toUserId : loggedInUser._id,
            status : 'interested'
        }).populate("fromUserId", USER_SAFE_DATA)
        return res.status(200).json({message:"Successfully fetched", pendingRequest})
    }
    catch(err){
        return res.status(500).json({"Error" : err.message})
    }
})

userRouter.get("/user/connections", userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user
        const connections = await connectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id},
                {fromUserId : loggedInUser._id},
            ],
            status : 'accepted'
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA)

        const data = connections.map(row => {
            if((row.fromUserId._id).toString() == (loggedInUser._id).toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        return res.status(200).json({message:"Successfully fetched", data})
    }
    catch(err){
        return res.status(500).json({"Error" : err.message})
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user

        const page = parseInt (req.query.page) || 1
        let limit = parseInt (req.query.limit) || 10
        limit > 50 ? 50 : limit
        const skipRecord = (page-1)*10
        const alreadyConnected = await connectionRequest.find({
            $or:[
                {toUserId : loggedInUser._id},
                {fromUserId : loggedInUser._id}
            ]
        })
        const set = new Set()
        alreadyConnected.forEach((request) => {
            set.add(request.fromUserId)
            set.add(request.toUserId)
        })
        const data = await User.find({
            $and : [
                {_id : {$nin : Array.from(set)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skipRecord).limit(limit)
        return res.status(200).json({data:data})
    }
    catch(err){
        return res.status(500).json({"Error" : err.message})
    }
})

module.exports = userRouter