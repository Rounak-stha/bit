const chalk = require('chalk')
const arg = require('arg')
const { USAGE } = require('./labels')
const { createGitDirectory } = require('./main/init')
const { argConfig } = require('./configs')
const { catFile } = require('./main/catFile')
const { writeTree } = require('./main/tree/writeTree')
const { hashObject } = require('./main/hashObject')

const ARGS = arg(argConfig, { permissive: true })

function main() {
    const command = ARGS['_'][0]

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
    console.log(chalk.redBright(e.message))
}
