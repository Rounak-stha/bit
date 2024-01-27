const { GitObject, BlobObject, TreeObject } = require('./object')

function fileContent(hash) {
    const data = GitObject.read(hash)
    const decompressedData = GitObject.deserialize(data)
    const prefix = decompressedData.subarray(0, 6).toString()

    let contents = ''

    if (prefix.startsWith('blob')) {
        contents = BlobObject.extractContent(decompressedData)
    } else if (prefix.startsWith('tree')) {
        contents = TreeObject.extractContent(decompressedData)
    } else if (prefix.startsWith('commit')) {
        contents = TreeObject.extractContent(decompressedData)
    }

    console.log(contents)
}

/**
 *
 * @param {Buffer} hash
 * @returns {import('../types').GitObjectType}
 */
function fileType(hash) {
    const data = GitObject.deserialize(GitObject.read(hash))
    const objectType = data.subarray(0, data.indexOf(32)).toString()
    console.log(objectType)
}

function catFile(args) {
    const fileHash = args['-p'] || args['-t']
    const catFileCase = process.argv[3]

    switch (catFileCase) {
        case '-p':
            fileContent(fileHash)
            break
        case '-t':
            fileType(fileHash)
            break
    }
}

module.exports = { catFile }
