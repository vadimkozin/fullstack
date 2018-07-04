const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth')
const analyticsRouter = require('./routes/analitics')
const categoryRouter = require('./routes/category')
const orderRouter = require('./routes/order')
const positionRouter = require('./routes/position')
//const keys = require('./config/keys')

const app = express()
//mongoose.connect(keys.mongoURI)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())

app.use('/api/auth', authRouter)
app.use('/api/analitics', analyticsRouter)
app.use('/api/category', categoryRouter)
app.use('/api/order', orderRouter)
app.use('/api/position', positionRouter)

module.exports = app