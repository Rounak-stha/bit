const { getFileContents, createGitObject } = require('../../helpers')
const { BlobObject } = require('../object')

function createBlobData(filePath) {
    const fileContents = getFileContents(filePath).toString()
    return BlobObject.serialize(fileContents)
}

/**
 *
 * @param {import('arg').Result} args
 */
function createBlob(filePath) {
    const { serializedData, hash } = createBlobData(filePath)
    createGitObject(serializedData, hash)
}

module.exports = { createBlobData, createBlob }
