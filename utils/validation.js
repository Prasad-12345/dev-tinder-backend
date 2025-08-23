const validator = require('validator')

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body
    if(!firstName || !lastName){
        throw new Error("First name and last name are required fields")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Enter valid emailId")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password")
    }
}

const validateProfileEditData = (req) => {
    const updateAllowed = ['firstName', 'lastName', 'photoUrl', 'about', 'skills', 'gender', 'age', 'emailId'];
    const dataToUpdate = req.body
    const isUpdateAllowed = Object.keys(dataToUpdate).every(key => updateAllowed.includes(key))
    return isUpdateAllowed
}

const validateReserPasswordData = (req) => {
    const {currentPassword, newPassword} = req.body
    if(!currentPassword){
        throw new Error("Current password is required")
    }
    if(!newPassword){
        throw new Error("New password is required")
    }
}

module.exports = { validateSignUpData, validateProfileEditData, validateReserPasswordData }