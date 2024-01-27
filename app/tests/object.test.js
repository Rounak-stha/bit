const test = require('node:test')
const { BlobObject, TreeObject } = require('../main/object')
const assert = require('assert')
const { writeFileSync } = require('fs')

const { describe, it } = test

const EXPECTED_BLOB_SERIALIZED_DATA = Buffer.from([
    120, 156, 75, 202, 201, 79, 82, 48, 52, 100, 240, 72, 205, 201, 201, 87, 8, 207, 47, 202, 73, 1, 0, 59, 123, 6, 62,
])

const EXPECTED_TREE_SERIALIZED_DATA = Buffer.from([
    120, 156, 43, 41, 74, 77, 85, 48, 52, 177, 96, 48, 52, 48, 48, 51, 49, 81, 72, 203, 204, 73, 77, 212, 43, 169, 40, 97, 120, 119, 224, 63, 26, 58,
    240, 31, 73, 81, 18, 88, 17, 186, 18, 144, 42, 3, 19, 3, 32, 0, 43, 74, 198, 165, 136, 7, 73, 81, 10, 88, 17, 134, 18, 32, 2, 0, 20, 233, 92, 86,
])

const TREE_ENTRIES = [
    { mode: '100644', type: 'blob', hash: 'ffeec0ffeec0ffeec0ffeec0ffeec0ffeec0ffc0', filename: 'fileb.txt' },
    { mode: '040000', type: 'tree', hash: 'c0ffeec0ffeec0ffeec0ffeec0ffeec0ffeec0ff', filename: 'filed.txt' },
    { mode: '100644', type: 'blob', hash: 'eec0ffeec0ffeec0ffeec0ffeec0ffeec0ffc0ff', filename: 'filea.txt' },
    { mode: '040000', type: 'tree', hash: 'ffeec0ffeec0ffeec0ffeec0ffeec0ffeec0ff0c', filename: 'filec.txt' },
]

const DESERIALIZED_TREE_DATA = `100644 blob eec0ffeec0ffeec0ffeec0ffeec0ffeec0ffc0ff	filea.txt
100644 blob ffeec0ffeec0ffeec0ffeec0ffeec0ffeec0ffc0	fileb.txt
040000 tree ffeec0ffeec0ffeec0ffeec0ffeec0ffeec0ff0c	filec.txt
040000 tree c0ffeec0ffeec0ffeec0ffeec0ffeec0ffeec0ff	filed.txt`

describe('Blob Object', () => {
    it('Should Serialize the Data', () => {
        const data = 'Hello World'
        const { serializedData, hash } = BlobObject.serialize(data)

        assert(serializedData, 'SerializedData is undefined')
        assert(hash, 'Hash is undefined')
        assert(Buffer.isBuffer(serializedData), 'SerializedData is not a Buffer')
        assert.deepEqual(serializedData, EXPECTED_BLOB_SERIALIZED_DATA)
        assert.equal(typeof hash, 'string', 'Hash is not a string')
        assert.equal(hash.length, 40, 'Hash is not 40 characters long')
    })

    it('Should Deserialize the Data', () => {
        const data = 'Hello World'
        const { serializedData } = BlobObject.serialize(data)
        const deserializedData = BlobObject.deserialize(serializedData)
        assert.strictEqual(deserializedData, data)
    })
})

describe('Tree Object', () => {
    it('Should Serialize the Tree Data', () => {
        const data = TREE_ENTRIES
        const { serializedData, hash } = TreeObject.serialize(data)

        writeFileSync('./test.txt', Array.from(serializedData).toString())
        assert(serializedData, 'SerializedData is undefined')
        assert(hash, 'Hash is undefined')
        assert(Buffer.isBuffer(serializedData), 'SerializedData is not a Buffer')
        assert.deepEqual(serializedData, EXPECTED_TREE_SERIALIZED_DATA)
        assert.equal(typeof hash, 'string', 'Hash is not a string')
        assert.equal(hash.length, 40, 'Hash is not 40 characters long')
    })

    it('Should Deserialize the Data', () => {
        const { serializedData } = TreeObject.serialize(TREE_ENTRIES)
        const deserializedData = TreeObject.deserialize(serializedData)
        assert.deepEqual(deserializedData, DESERIALIZED_TREE_DATA)
    })
})
