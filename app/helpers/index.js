const fs = require('node:fs')
const path = require('node:path')

const CWD = process.cwd()

/**
 * Finds the root of the project
 * OR Finds the directory hosting .git
 * @param {string} currPath
 * @param {boolean} required
 */
function findroot(currPath = CWD, required = false) {
    if (fs.existsSync(path.join(currPath, '.git'))) {
        return currPath
    }

    const parent = path.join(currPath, '..')

    if (parent == currPath) {
        if (required) throw new Error('No Root')
        return null
    }
    findroot(parent)
}

/**
 * Splits the Hash and returns the Object's Directory name and File Name
 * @param {string} hash
 * @returns {{ dirName: string, fileName: string }}
 */
function getDirAndFileName(hash) {
    if (!hash) {
        throw new Error('Object Identifier is requried')
    }

    const dirName = hash.slice(0, 2)
    const fileName = hash.slice(2, hash.length)

    return { dirName, fileName }
}

/**
 * Gets the data inside the Object fie specified by the dirname and filename
 * @param {string} dirName
 * @param {string} fileName
 * @returns The contents stored in the object as Buffer
 */
function getGitFileContents(dirName, fileName) {
    const root = findroot(CWD, true)
    if (!root) {
        throw new Error('Git is not initialied')
    }
    return fs.readFileSync(
        path.join(root, '.git', 'objects', dirName, fileName)
    )
}

/**
 * Gets the data inside the Object File Specified by the Hash
 * @param {string} hash
 * @returns The contents stored in the object as Buffer
 */
function readObjectContent(hash) {
    const { dirName, fileName } = getDirAndFileName(hash)
    const root = findroot(CWD, true)
    if (!root) {
        throw new Error('Git is not initialied')
    }
    return fs.readFileSync(
        path.join(root, '.git', 'objects', dirName, fileName)
    )
}

/**
 * Create New Object Entry
 * @param {*} data
 * @param {string} hash
 * @returns
 */
function createGitObject(data, hash) {
    const { dirName, fileName } = getDirAndFileName(hash)
    const objectDir = path.join('.git', 'objects', dirName)
    if (!fs.existsSync(objectDir)) {
        fs.mkdirSync(objectDir)
    }
    fs.writeFileSync(path.join(objectDir, fileName), data)
}

/**
 * Helper to read file contents
 * @param {string} filePath
 * @returns Contents of file as Buffer
 */
function getFileContents(filePath) {
    try {
        return fs.readFileSync(path.join(process.cwd(), filePath))
    } catch (e) {
        throw new Error('Invalid Object Identifier')
    }
}

module.exports = {
    findroot,
    getFileContents,
    getGitFileContents,
    getDirAndFileName,
    readObjectContent,
    createGitObject,
}
