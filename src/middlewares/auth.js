const adminAuth = (req, res, next) => {
    const token = "xyz";
    if(token != 'xyz'){
        res.status(401).send("not authorized")
    }
    else{
        next()
    }
}

module.exports = {
    adminAuth
}