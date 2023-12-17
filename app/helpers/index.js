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

module.exports = { findroot }
