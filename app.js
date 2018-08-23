const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth')
const analyticsRouter = require('./routes/analytics')
const categoryRouter = require('./routes/category')
const orderRouter = require('./routes/order')
const positionRouter = require('./routes/position')
const userRouter = require('./routes/user')
const keys = require('./config/keys')
const errorHandler = require('./utils/errorHandler')

const app = express()

mongoose.connect(keys.MONGO_URI, { useNewUrlParser: true })
     .then(() => console.log('MongoDB connected.'))
     .catch((error) => console.error(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())

app.use('/api/auth', authRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/category', categoryRouter)
app.use('/api/order', orderRouter)
app.use('/api/position', positionRouter)

app.use('/api/users', userRouter)   // временно для тестирования 

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist/client'))

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'index.html'
            )
        )
    })
}

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
    console.log('QQQQ.QQQQ.QQQQ')
     errorHandler(res, err)
})


module.exports = app