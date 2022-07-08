require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const app = express()
const port = process.env.PORT || 3000

// DB Connection
mongoose.connect(process.env.DATABASE,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true
}).then(() => {
    console.log('DB CONNECTED...')
}).catch((err) => {
    console.log('err occured in DB Connecting...',err)
});

// middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// My Routes
app.use('/api',authRoutes)
app.use('/api',userRoutes)

// server running
app.listen(port, () => {
    console.log(`mern app is running on port - ${port}`)
})