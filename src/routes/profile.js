const express = require("express")
const {userAuth} = require("../middlewares/user")
const { validateProfileEditData, validateReserPasswordData } = require("../../utils/validation")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const sendMail = require("../../utils/sendMail")

const profileRouter = express.Router()

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    if(req.user){
        return res.send(req.user)
    }
    return res.send("user not found")
})

profileRouter.post('/profile/edit', userAuth,async (req, res)=>{
    try{
        if(!validateProfileEditData(req)){
            return res.json({'status':500, "message" : "Invalid update request"})
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
            return res.json({'status':200, "message" : "Password updated successfully"})
        }
        return res.json({'status':500, "message" : "Please enter correct current password"})
    }
    catch(err){
        return res.json({'status':500, "message" : err.message})
    }
})

profileRouter.post('/send-email', async(req, res)=> {
    // return res.send({1:process.env.EMAIL_USER, 2:process.env.EMAIL_PASS})
    const id = await sendMail({
        to:"prasadsomvanshi471@gmail.com",
        subject:"test node email",
        text:"something...",
        html:"<h1>Hiii</h1>"
    })
    return res.send(id)
})
module.exports = profileRouter