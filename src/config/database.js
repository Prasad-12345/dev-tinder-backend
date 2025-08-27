const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.db_url);
    }
    catch(err){
        console.log("message" + err.message)
        // res.status(500).json({message:err.message})
        throw new Error(err)
    }
}

module.exports = connectDB