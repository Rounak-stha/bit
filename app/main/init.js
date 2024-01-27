const fs = require('node:fs')
const path = require('node:path')
const chalk = require('chalk')
const { findroot } = require('../helpers')

const log = console.log

const ROOT = findroot()
/**
 * Initializes git for the project if not already initialized
 */
function createGitDirectory() {
    if (ROOT) {
        throw new Error('Bit is already initialized')
    }
    fs.mkdirSync(path.join(__dirname, '.git'), { recursive: true })
    fs.mkdirSync(path.join(__dirname, '.git', 'objects'), {
        recursive: true,
    })
    fs.mkdirSync(path.join(__dirname, '.git', 'refs'), { recursive: true })
    fs.writeFileSync(
        path.join(__dirname, '.git', 'HEAD'),
        'ref: refs/heads/master\n'
    )
    log(chalk.greenBright('Initialized git directory'))
}

module.exports = { createGitDirectory }
