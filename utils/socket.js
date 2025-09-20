const socket = require("socket.io")
const Chat = require("../src/model/chat")
const connectionRequest = require("../src/model/connectionRequest")

const initializeSocket = (server) => {
    const io = socket(server, {
        cors:{
            origin:["http://localhost:5173", "https://dev-tinder-web-2c4g.onrender.com"],
            credentials: true
        },
    })

    io.on("connection", (socket) => {
        socket.on("joinChat", ({userId, targetUserId}) => {
            const roomId = [userId, targetUserId].sort().join("_")
            console.log("joining room" + roomId)
            socket.join(roomId)
        })

        socket.on("sendMessage", async ({firstName, lastName,userId, targetUserId, text}) => {
            const roomId = [userId, targetUserId].sort().join("_")
            // console.log("received msg" + text)

            // save message to db
            try{
                // Todo : check connections, last seen, online, limit msg on api call
                let chat = await Chat.findOne({
                    participants : {$all : [userId, targetUserId]}
                })
                if(!chat){
                    chat = new Chat({
                        participants : [userId, targetUserId],
                        messages : []
                    })
                }
                chat.messages.push({
                    senderId : userId,
                    text
                })
                await chat.save()
                io.to(roomId).emit("messageReceived", {firstName, lastName, text})
            }
            catch(err){
                console.log(err)
            }
        })

        socket.on("disconnect", () => {
            
        })
    })
}

module.exports = initializeSocket