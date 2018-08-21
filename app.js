const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth')
const analyticsRouter = require('./routes/analitics')
const categoryRouter = require('./routes/category')
const orderRouter = require('./routes/order')
const positionRouter = require('./routes/position')
const userRouter = require('./routes/user')
//const keys = require('./config/keys')
const errorHandler = require('./utils/errorHandler')

const app = express()

//mongoose.connect(keys.mongoURI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
     .then(() => console.log('MongoDB connected.'))
     .catch((error) => console.error(error))

//require('./db')

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

app.use('/api/users', userRouter)   // временно для тестирования 


// catch 404 and forward to error handler
app.use((req, res, next) => {
    console.error('маршрут не найден : ', req.originalUrl)
    
    res.status(404).json({
        success: false,
        message: `Маршрут не найден : ${req.originalUrl}`
    })
    //next(err)
})

// error handler
app.use((err, req, res, next) => {
    console.log('QQQQQQQQQQQQQQQ')
     errorHandler(res, err)

})


module.exports = app