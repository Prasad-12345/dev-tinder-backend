const express = require("express")
const {userAuth} = require("../middlewares/user")
const { validateProfileEditData, validateReserPasswordData } = require("../../utils/validation")
const bcrypt = require("bcrypt")

const profileRouter = express.Router()

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    if(req.user){
        res.send(req.user)
    }
    res.send("user not found")
})

profileRouter.post('/profile/edit', userAuth,async (req, res)=>{
    try{
        if(!validateProfileEditData(req)){
            res.json({'status':500, "message" : "Invalid update request"})
        }
        const user = req.user
        Object.keys(req.body).forEach(key => user[key] = req.body[key])
        await user.save()
        return res.json({'status':200, "message":"Profile updated successfully", "data":user})
    }
    catch(err){
        return res.json({'status':500, "message" : err.message})
    }
})

profileRouter.patch('/profile/password', userAuth, async(req, res)=>{
    try{
        validateReserPasswordData(req)
        const user = req.user
        const isPasswordMatches = await user.validatePassword(req.body.currentPassword)
        if(isPasswordMatches){
            user.password = await bcrypt.hash(req.body.newPassword, 10)
            await user.save()
            res.json({'status':200, "message" : "Password updated successfully"})
        }
        res.json({'status':500, "message" : "Please enter correct current password"})
    }
    catch(err){
        res.json({'status':500, "message" : err.message})
    }
})

module.exports = profileRouter