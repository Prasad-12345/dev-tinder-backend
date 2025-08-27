const cron = require('node-cron')
const {subDays, startOfDay, endOfDay} = require('date-fns')
const connectionRequest = require('../src/model/connectionRequest')
const sendMail = require('./sendMail')

console.log("App started...")
cron.schedule("8 * * * *", async () => {
  try{
    const yesterday = subDays(new Date(), 1)
    const yesterdatStart = startOfDay(yesterday)
    const yesterdayEnd = endOfDay(yesterday)
    const requests = await connectionRequest.find({
        status:"interested",
        createdAt : {
            $gte : yesterdatStart,
            $lt : yesterdayEnd
        }
    }).populate("fromUserId toUserId")

    const listOfEmails = [...new Set(requests.map((r)=>r.toUserId.emailId))]
    for(const emailId of listOfEmails){
        await sendMail({
            to:emailId,
            subject:"Pending request reminder",
            text:"",
            html:"<p>You have received a connection request yesterday. Please check.</p>"
        })
    }
  }
  catch(err){
    console.log(err.message)
  }
})