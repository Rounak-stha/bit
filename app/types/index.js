/**
 * @typedef { 'blob' | 'tree' | 'commit' } GitObjectType
 */

/**
 * Taken from Isomorphic Git Tree Entry Type
 * An entry from a git tree object. Files are called 'blobs' and directories are called 'trees'.
 *
 * @typedef {Object} TreeEntry
 * @property {string} mode the 6 digit hexadecimal mode
 * @property {string} filename the name of the file or directory
 * @property {string} hash the SHA-1 object id of the blob or tree
 * @property {'commit'|'blob'|'tree'} type the type of object
 */

/**
 * @typedef {TreeEntry[]} TreeEntries
 */

module.exports = {}
