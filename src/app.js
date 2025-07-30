const express = require("express")

const app = express()

// app.use('/', (req, res) => {
//     res.send("Hello World ....")
// })

app.use('/user', 
    [
        (req, res, next) => {
            console.log('1st response')
            next()
        },
        (req, res, next) => {
            console.log('2nd response')
            next()
        },
        (req, res, next) => {
            console.log('3rd response')
            next()
        },
        (req, res, next) => {
            console.log('4th response')
            // next()
            res.send("4th response")
        }
    ]
)

app.listen("7777", () => {
    console.log("server is running on a port 7777")
})