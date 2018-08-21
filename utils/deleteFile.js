// deleteFile(namefile): Promise

const fs = require('fs')

module.exports = (namefile) => {
    return new Promise((resolve, reject) => {
        fs.unlink(namefile, (err) => {
            (err) ? reject(err) : resolve(true)
          })      
    })
}
