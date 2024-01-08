const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const helmet = require('helmet')
const userRoute = require('./routes/user')
dotenv.config()
const app = express()
const port = process.env.PORT
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('mongodb connected!')
    })
    .catch(err =>console.log(err))

//middle ware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use('/api/user',userRoute)
app.listen(port, (req, res) => {
    console.log(`server is running on port:${port}`)
})