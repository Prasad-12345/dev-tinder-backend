const express = require("express")

const app = express()

app.use('/', (req, res) => {
    res.send("Hello World ....")
})

app.use('/test', (req, res) => {
    res.send("this is testing")
})

app.listen("7777", () => {
    console.log("server is running on a port 7777")
})