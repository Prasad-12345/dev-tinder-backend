const mongoose = require("mongoose")
const validator = require('validator')
const jsonwebtoken = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3
    },
    lastName : {
        type : String,
        required : true,
        minLength : 3
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowerCase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a valid email " + value)
            }
        }
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
        validate(value){
            if(value && !validator.isStrongPassword(value)){
                throw new Error("Enter strong password")
            }
        }
    },
    age : {
        type : Number,
        required : false,
        min : 18
    },
    gender : {
        type : String,
        required : false,
        validate(value){
            if(!["male", "female","other"].includes(value)){
                throw new Error("Not a valid gender")
            }
        }
    },
    photoUrl : {
        type:String,
        default : "",
        validate(value){
            if(value && !validator.isURL(value)){
                throw new Error("Photo url is invalid")
            }
        }
    },
    about:{
        type:String,
        default : ""
    },
    skills:{
        type:[String],
    },
    isPremium:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})


userSchema.methods.getJWT = async function () {
    const user = this
    const token = await jsonwebtoken.sign({_id : user._id}, 'Vickyfghbjn@54', {expiresIn:"7d"})
    return token
}

userSchema.methods.validatePassword = async function(password){
    const user = this
    const isPasswordValid = bcrypt.compare(password, user.password)
    return isPasswordValid
}

module.exports = mongoose.model('User', userSchema)