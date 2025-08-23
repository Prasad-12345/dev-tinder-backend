const jwt = require('jsonwebtoken')
const User = require('../model/user')
const userAuth = async (req, res, next) => {
    try{
        const { token } = req.cookies
        if(!token){
            res.status(401).send("Please login")
        }
        const decodedValue = await jwt.verify(token, 'Vickyfghbjn@54')
        const {_id} = decodedValue
        const user = await User.findById(_id);
        if(!user){
            res.status(401).send("user not found")
        }
        req.user = user
        next()
    }
    catch(err){
        res.status(400).send(err)
    }
}

module.exports = {
    userAuth
}