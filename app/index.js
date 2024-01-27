#!usr/bin/nodegetGitFileContents

const fs = require('fs')
const path = require('path')
const zlib = require('node:zlib')
const crypto = require('crypto')

const { findroot } = require('./helpers')
const chalk = require('chalk')
const { USAGE } = require('./helpers/labels')

const shasum = crypto.createHash('sha1')
const CWD = process.cwd()

const log = console.log

function getGitFileContents(dirName, fileName) {
	try {
		const root = findroot(CWD, true)
		if (!root) {
			throw new Error('Git is not initialied')
		}
		return fs.readFileSync(path.join(root, '.git', 'objects', dirName, fileName))
	} catch (e) {
		throw new Error('Invalid Object')
	}
}

function gitFileContents(filePath) {
	try {
		return fs.readFileSync(path.join(process.cwd(), filePath))
	} catch (e) {
		throw new Error('Invalid Object')
	}
}

function getDirAndFileName() {
	const filePathName = process.argv[4]

	if (!filePathName) {
		throw new Error('Object Identifier is requried')
	}

	const dirName = filePathName.slice(0, 2)
	const fileName = filePathName.slice(2, filePathName.length)

	return [dirName, fileName]
}

/**
 *
 * @param {string} content
 */
function getObjectType(content) {
	log(content)
	log(content.slice(0, content.indexOf(' ')))
}

function decompress(dirName, fileName) {
	const fileContents = getGitFileContents(dirName, fileName)
	const decompressedContents = zlib.inflateSync(fileContents).toString()
	process.stdout.write(decompressedContents.split('\x00')[1])
}

function hashObject() {
	const hashObjectCase = process.argv[3]
	const filePath = process.argv[4]

	if (!filePath) {
		throw new Error('Please Include File')
	}

	const fileContents = gitFileContents(filePath).toString()
	const objectData = 'blob ' + fileContents.length + '\0' + fileContents
	const hash = shasum.update(objectData).digest('hex')

	switch (hashObjectCase) {
		case '-w':
			createBlobObject(objectData, hash)
	}
}

function catFile() {
	const catFileCase = process.argv[3]
	const [dirName, fileName] = getDirAndFileName()
	switch (catFileCase) {
		case '-p':
			decompress(dirName, fileName)
	}
}

/**
 *
 * @param {string} filePath
 */
function createBlobObject(data, hash) {
	const zLibbedObjectData = zlib.deflateSync(data)
	const objectDir = path.join('.git', 'objects', hash.slice(0, 2))
	if (!fs.existsSync(objectDir)) {
		fs.mkdirSync(objectDir)
	}
	fs.writeFileSync(path.join(objectDir, hash.slice(2, hash.length)), zLibbedObjectData, {
		flag: 'w+'
	})
}

function createGitDirectory() {
	if (ROOT) {
		throw new Error('Bit is already initialized')
	}
	fs.mkdirSync(path.join(__dirname, '.git'), { recursive: true })
	fs.mkdirSync(path.join(__dirname, '.git', 'objects'), { recursive: true })
	fs.mkdirSync(path.join(__dirname, '.git', 'refs'), { recursive: true })
	fs.writeFileSync(path.join(__dirname, '.git', 'HEAD'), 'ref: refs/heads/master\n')
	log(chalk.greenBright('Initialized git directory'))
}

function main() {
	const command = process.argv[2]

	if (!command) throw new Error(USAGE)

	switch (command) {
		case 'init':
			createGitDirectory()
			break
		case 'cat-file':
            catFile(ARGS)
			break
		case 'hash-object':
            hashObject(ARGS)
			break
        case 'write-tree':
            writeTree()
			break
		default:
			throw new Error(`Unknown command ${command}`)
	}
}

try {
	main()
} catch (e) {
	log(chalk.redBright(e.message))
}
