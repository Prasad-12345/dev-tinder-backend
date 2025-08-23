const express = require("express")
// const {adminAuth} = require("./middlewares/auth")
const connectDB = require('./config/database')
const cookies = require('cookie-parser')
const cors = require("cors")

// mongodb+srv://prasad:prasad%401998@namastenode.63rje9t.mongodb.net/
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200
}))

app.use(express.json())
app.use(cookies())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestsRouter = require('./routes/requests')
const userRouter = require("./routes/user")

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestsRouter)
app.use('/', userRouter)

connectDB().then(() => {
    console.log("connected to DB")
    app.listen("7777", () => {
        console.log("server is running on a port 7777")
    })
}).catch(() => {
    // console.log("error occured while connecting to DB")
})
