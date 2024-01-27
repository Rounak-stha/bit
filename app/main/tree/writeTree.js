const { createGitObject } = require('../../helpers')
const { TreeObject } = require('../object')

// This is a temporary data structure to test the writeTree function
const tempEntries = [
    { mode: '040000', type: 'blob', hash: 'C0FFEEC0FFEEC0FFEE00C0FFEEC0FFEEC0FFEE00', filename: 'fileb.txt' },
    { mode: '040000', type: 'blob', hash: 'C0FFEEC0FFEEC0FFEE00C0FFEEC0FFEEC0FFEE00', filename: 'filed.txt' },
    { mode: '040000', type: 'blob', hash: 'C0FFEEC0FFEEC0FFEE00C0FFEEC0FFEEC0FFEE00', filename: 'filea.txt' },
    { mode: '040000', type: 'blob', hash: 'C0FFEEC0FFEEC0FFEE00C0FFEEC0FFEEC0FFEE00', filename: 'filec.txt' },
]

function writeTree() {
    const { serializedData, hash } = TreeObject.serialize(tempEntries)
    createGitObject(serializedData, hash)
    process.stdout.write(hash)
}

module.exports = { writeTree }
