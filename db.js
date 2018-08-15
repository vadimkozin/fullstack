// lsof -i tcp:5000
// kill -9 PID
const mongoose = require('mongoose')

function shutdown (msg, cb) {
    mongoose.connection.close(() => {
        console.log('Mongoose disconnected ', msg)
        cb()
    })
}

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log('Mongoose connected'))
    .catch((error) => console.error(error))

process.nextTick(() => {
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to', process.env.MONGO_URI)
    })
    
    mongoose.connection.on('error', (err) => {
        console.log('Mongoose connection error: ', err)
    })
    
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected')
    })
    
    // для перезапуска nodemon
    process.once('SIGUSR2', () => {
        shutdown('nodemon restart', () => {
            console.log('удаляю процесс:' , process.pid)
            process.kill(process.pid, 'SIGUSR2')
        })
    })
    
    // для завершения приложения
    process.on('SIGINT', () => {
        shutdown('app termination', () => {
            process.exit(0);
        })
    })
    
    // для завершения приложения Heroku
    process.on('SIGTERM', () => {
        shutdown('Heroku app shutdown', () => {
            process.exit(0)
        })
    })
})

