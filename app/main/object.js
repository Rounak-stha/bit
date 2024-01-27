const zlib = require('node:zlib')
const crypto = require('crypto')
const { readObjectContent, createGitObject } = require('../helpers')

const shasum = crypto.createHash('sha1')

const FILE_MODE_TO_TYPE = {
    100644: 'blob',
    '040000': 'tree',
}

/// Object Header Structure: <Object Type><Space><Object Size><Null Character><Object Contents>

const GitObject = {
    /**
     * reads the Contents of the Git Object Identified by the Passed Hash
     * @param {string} hash
     */
    read(hash) {
        return readObjectContent(hash)
    },

    /**
     *
     * @param {*} data
     * @param {string} hash
     */
    write(data, hash) {
        createGitObject(data, hash)
    },

    /**
     * Serializes the Data(Blob | Tree | Commit)
     * @param {any} data
     */
    serialize(data) {
        return zlib.deflateSync(data)
    },

    /**
     * Deserializes the Buffer Read from the Git Object
     * @param {Buffer} data
     */
    deserialize(data) {
        return zlib.inflateSync(data)
    },
}

const BlobObject = {
    /**
     * Formats the data in reuired shape and Serializes | Compresses the blob data
     * Format: blob {DATA_LENGTH}{NULL_CHARACTER}{Contents}
     * @param {any} data
     * @returns {{serializedData: Buffer, hash: string}}
     */
    serialize(data) {
        const dataLength = data.length
        const formattedData = `blob ${dataLength}\0${data}`
        const serializedData = GitObject.serialize(formattedData)
        const hash = shasum.update(formattedData).digest('hex')
        return { serializedData, hash }
    },

    /**
     * Returns the Contents of the Blob Data Held by the Blob Object
     * @param {Buffer} data
     * @returns {string}
     */
    deserialize(data) {
        const decompressedContents = GitObject.deserialize(data)
        return this.extractContent(decompressedContents)
    },

    /**
     * Extracts the Content of the File Stored in the Blob
     * @param {Buffer} data
     * @returns {string}
     */
    extractContent(data) {
        const deserializedData = data.subarray(data.indexOf('\0'))
        return deserializedData.toString()
    },
}

const TreeObject = {
    /**
     * Sorts the entries alphabetically by filename
     * @param {import('../types').TreeEntries} entries
     */
    sortEntries(entries) {
        entries.sort((a, b) => {
            if (a.filename === b.filename) return 0
            if (a.filename > b.filename) return 1
            return -1
        })
    },

    /**
     * Formats the data in reuired shape and Serializes | Compresses the blob data
     * Format: blob {DATA_LENGTH}{NULL_CHARACTER}{Contents}
     * @param {import('../types').TreeEntries} data
     * @returns {{serializedData: Buffer, hash: string}}
     */
    serialize(data) {
        this.sortEntries(data)
        const entries = Buffer.concat(
            data.map((entry) => {
                const mode = Buffer.from(entry.mode)
                const space = Buffer.from(' ')
                const filename = Buffer.from(entry.filename, 'utf8')
                const nullchar = Buffer.from([0x00])
                const hash = Buffer.from(entry.hash, 'hex')
                return Buffer.concat([mode, space, filename, nullchar, hash])
            })
        )
        let header = Buffer.from('tree ' + entries.length.toString())
        const nullchar = Buffer.from([0x00])
        const treeData = Buffer.concat([header, nullchar, entries])
        const hash = shasum.update(treeData).digest('hex')
        const serializedData = GitObject.serialize(treeData)

        return { serializedData, hash }
    },

    /**
     * Extracts the Content of the File Stored in the Blob
     * @param {Buffer} data
     * @returns {string}
     */
    extractContent(data) {
        let contents = data.subarray(data.indexOf('\0') + 1)

        let cursor = 0

        let parsedContents = []

        for (let i = 0; i < contents.length; i = cursor) {
            const spaceIndex = contents.indexOf(' ', cursor)
            if (!spaceIndex) {
                throw new Error('No Space Index')
            }
            const nullIndex = contents.indexOf('\0', spaceIndex) // Each Entry is Separated by the Null Char | NOTE: DONOT SPLIT BY '\0' as Hash is stored as binary and can include the null char
            if (!nullIndex) {
                throw new Error('No Null Index')
            }
            const mode = contents.subarray(cursor, spaceIndex).toString().padStart(6, '0')
            const name = contents.subarray(spaceIndex + 1, nullIndex).toString()
            const hash = contents.subarray(nullIndex + 1, nullIndex + 21).toString('hex') // SHA-1 is 20 Chars Long

            const type = FILE_MODE_TO_TYPE[mode]

            cursor = nullIndex + 21
            parsedContents.push(`${mode} ${type} ${hash}\t${name}`)
        }

        return parsedContents.join('\n')
    },
}

const CommitObject = {
    /**
     * Extracts the Content of the File Stored in the Blob
     * @param {Buffer} data
     * @returns {string}
     */
    extractContent(data) {
        const deserializedData = data.subarray(data.indexOf('\0') + 1)
        return deserializedData.toString()
    },
}

module.exports = { GitObject, BlobObject, TreeObject, CommitObject }
