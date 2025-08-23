const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://prasad:prasad%401998@namastenode.63rje9t.mongodb.net/devTinder");
    }
    catch(err){
        console.log("message" + err.message)
        // res.status(500).json({message:err.message})
        throw new Error(err)
    }
}

module.exports = connectDB