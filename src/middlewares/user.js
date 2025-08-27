const jwt = require('jsonwebtoken')
const User = require('../model/user')
const userAuth = async (req, res, next) => {
    try{
        const { token } = req.cookies
        if(!token){
            return res.status(401).send("Please login")
        }
        const decodedValue = await jwt.verify(token, 'Vickyfghbjn@54')
        const {_id} = decodedValue
        const user = await User.findById(_id);
        if(!user){
            return res.status(401).send("user not found")
        }
        req.user = user
        next()
    }
    catch(err){
        return res.status(400).send(err)
    }
}

module.exports = {
    userAuth
}