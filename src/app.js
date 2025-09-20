// const express = require("express")
// // const {adminAuth} = require("./middlewares/auth")
// const connectDB = require('./config/database')
// const cookies = require('cookie-parser')
// const cors = require("cors")
// const dotenv = require("dotenv")
// // mongodb+srv://prasad:prasad%401998@namastenode.63rje9t.mongodb.net/
// const app = express()
// dotenv.config()
// require('../utils/cronJob')

// app.use(express.json())

// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Origin", "https://dev-tinder-web-2c4g.onrender.com");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
//     return res.sendStatus(200); // respond to preflight without hitting routes
//   }
//   next(); // continue to normal routes for non-OPTIONS requests
// });

// app.use(cors({
//     // origin: ["http://localhost:5173","https://dev-tinder-web-2c4g.onrender.com"],
//     origin: "https://dev-tinder-web-2c4g.onrender.com",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type","Authorization"]
// }));

// app.use(cookies())

// const authRouter = require('./routes/auth')
// const profileRouter = require('./routes/profile')
// const requestsRouter = require('./routes/requests')
// const userRouter = require("./routes/user")
// const paymentRouer = require("./routes/payment")
// const http = require("http")
// const initializeSocket = require("../utils/socket")
// const chatRouter = require("./routes/chat")

// app.use('/', authRouter)
// app.use('/', profileRouter)
// app.use('/', requestsRouter)
// app.use('/', userRouter)
// app.use('/', paymentRouer)
// app.use('/', chatRouter)

// const server = http.createServer(app)
// initializeSocket(server)

// connectDB().then(() => {
//     server.listen(process.env.port, () => {
//         console.log("server is running on a port " + process.env.port)
//     })
// }).catch(() => {
//     console.log("error occured while connecting to DB")
// })

const express = require("express");
const connectDB = require("./config/database");
const cookies = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();
const app = express();
require('../utils/cronJob');

const allowedOrigin = "https://dev-tinder-web-2c4g.onrender.com";

// 1️⃣ JSON parser first
app.use(express.json());

// 2️⃣ Preflight handler BEFORE routers
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", allowedOrigin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.sendStatus(200); // respond to preflight
  }
  next();
});

// 3️⃣ Normal CORS for non-OPTIONS requests
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// 4️⃣ Cookie parser
app.use(cookies());

// 5️⃣ Routes
// IMPORTANT: mount routers AFTER preflight
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/request', require('./routes/requests'));
app.use('/user', require('./routes/user'));
app.use('/payment', require('./routes/payment'));
app.use('/chat', require('./routes/chat'));

// 6️⃣ HTTP server + socket
const server = http.createServer(app);
require("../utils/socket")(server);

// 7️⃣ Connect DB + start server
connectDB()
  .then(() => {
    server.listen(process.env.port, () => {
      console.log("Server running on port " + process.env.port);
    });
  })
  .catch(err => {
    console.error("Error connecting to DB:", err);
  });
