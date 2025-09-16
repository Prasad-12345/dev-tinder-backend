const express = require("express")
// const {adminAuth} = require("./middlewares/auth")
const connectDB = require('./config/database')
const cookies = require('cookie-parser')
const cors = require("cors")
const dotenv = require("dotenv")
// mongodb+srv://prasad:prasad%401998@namastenode.63rje9t.mongodb.net/
const app = express()
dotenv.config()
require('../utils/cronJob')

const corsOptions = {
    origin: 'https://dev-tinder-web-2c4g.onrender.com', // only your frontend
    credentials: true, // allow cookies/authorization headers
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json())
app.use(cookies())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestsRouter = require('./routes/requests')
const userRouter = require("./routes/user")
const paymentRouer = require("./routes/payment")
const http = require("http")
const initializeSocket = require("../utils/socket")
const chatRouter = require("./routes/chat")

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestsRouter)
app.use('/', userRouter)
app.use('/', paymentRouer)
app.use('/', chatRouter)

const server = http.createServer(app)
initializeSocket(server)

connectDB().then(() => {
    server.listen(process.env.port, () => {
        console.log("server is running on a port " + process.env.port)
    })
}).catch(() => {
    console.log("error occured while connecting to DB")
})
