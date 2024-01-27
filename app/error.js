/* const fs = require('fs')
const path = require('node:path')
 */
// const LOG_FILE_PATH = path.join(__dirname, 'LOGS.txt')
/**
 * @param {Error} err
 */
function errorHandler(err) {
    const { message, name } = err
    const time = new Date().toISOString()
    const data = JSON.stringify({
        name,
        message,
        time,
    })

    console.log(data)
    // fs.appendFileSync(LOG_FILE_PATH, data + '\n')
}

module.exports = { errorHandler }
