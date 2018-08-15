// deleteFile(namefile): Promise

const fs = require('fs')

module.exports = (namefile) => {
    return new Promise((resolve, reject) => {
        fs.unlink(namefile, (err) => {
            // if (err) { 
            //     reject(err)
            // } else {
            //     resolve(true)
            // }
            (err) ? reject(err) : resolve(true)
          })      
    })
}
