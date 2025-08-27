const nodemailer = require("nodemailer")

const sendMail = async ({to, subject, text, html}) => {
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })

    const info = await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:to,
        subject:subject,
        text:text,
        html:html
    })
    return info.messageId
}

module.exports = sendMail