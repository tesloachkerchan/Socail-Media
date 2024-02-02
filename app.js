const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors');
const morgan = require('morgan')
const helmet = require('helmet')
const multer = require('multer')
const path = require('path')
const userRoute = require('./routes/Users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
dotenv.config()
const app = express()
const port = process.env.PORT
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('mongodb connected!')
    })
    .catch(err => console.log(err))
 
    app.use('/images',express.static(path.join(__dirname,'public/images')))

//middle ware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        res.status(200).json('file uploaded!')
    } catch (err) {
        console.log(err)
    }
})

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(port, (req, res) => {
    console.log(`server is running on port:${port}`)
})