const { createBlob } = require('./blob/createBlob')

/**
 *
 * @param {import('arg').Result} args
 */
function hashObject(args) {
    const hashObjectCase = process.argv[3]
    const filePath = args['-w']

    if (!hashObjectCase) {
        throw new Error('Please Include Options')
    }

    if (!filePath) {
        throw new Error('Please Include File')
    }

    switch (hashObjectCase) {
        case '-w':
            createBlob(filePath)
    }
}

module.exports = { hashObject }
