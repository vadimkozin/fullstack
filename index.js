require('dotenv').load()
const keys = require('./config/keys')
const app = require('./app')
const port = keys.PORT || 5000

app.listen(port, () => console.log(`Server has been started on ${port}`))
    .on('error', err => { console.log('_ERROR::', err) })

//--------------------------------------
// отладка сигналов
//process.on('SIGINT', () => {console.log('signal: ', 'SIGINT')})
//process.on('SIGTERM', () => {console.log('signal: ', 'SIGTERM')})
//process.on('SIGUSR2', () => {console.log('signal: ', 'SIGUSR2')})
