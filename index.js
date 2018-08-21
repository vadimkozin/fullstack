require('dotenv').load()
const app = require('./app')
const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server has been started on ${port}`))
    .on('error', err => { console.log('_ERROR::', err) })
//
//--------------------------------------

process.on('SIGUSR2', () => {
    console.log('signal_: ', 'SIGUSR2')
    console.log('eventNames:',app.eventNames())
    //app.removeAllListeners()

})
process.on('SIGINT', () => {console.log('signal: ', 'SIGINT')})
process.on('SIGTERM', () => {console.log('signal: ', 'SIGTERM')})

/*
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
*/