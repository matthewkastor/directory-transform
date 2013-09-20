/*jslint
    white : true,
    vars : true,
    node : true,
    stupid : true
*/
/**
 * Node module to get stats of every item in a directory.
 * @fileOverview Node module to get stats of every item in a directory.
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 */
/** @private */
function stater(l, dir, callback) {
    'use strict';
    var fs = require('fs');
    var statType = l ? 'lstatSync' : 'statSync';
    var path = require('path');
    var arr = fs.readdirSync(path.resolve(dir));
    arr.forEach(function (file) {
        var stat = fs[statType](path.resolve(dir, file));
        callback(file, stat, dir);
    });
}
/**
 * The module.
 * @namespace The module.
 * @name module
 */
/**
 * The exports object.
 * @namespace The exports object.
 * @name module.exports
 */
/**
 * Runs fs.statSync on each item in the directory.
 * @param {String} dir Path to the directory to process.
 * @param {Function} callback The callback will be given three arguments: the
 *  name of the file being stat-ed, the stat object, and the parent directory.
 * @see <a href="http://nodejs.org/api/fs.html#fs_fs_statsync_path">fs.statSync
 * </a>
 * @example
 *  var path = require('path');
 *  var dirStatsSync = require('dir-stats-sync');
 *  
 *  var dir = path.resolve(__dirname, 'testData');
 *  
 *  function statCallback (item, stat, dir) {
 *      console.log(stat);
 *  }
 *  
 *  dirStatsSync.statDir(dir, statCallback);
 */
module.exports.statDir = function statDir(dir, callback) {
    'use strict';
    stater(false, dir, callback);
};
/**
 * Runs fs.lstatSync on each item in the directory.
 * @param {String} dir Path to the directory to process.
 * @param {Function} callback The callback will be given three arguments: the
 *  name of the file being stat-ed, the stat object, and the parent directory.
 * @see <a href="http://nodejs.org/api/fs.html#fs_fs_lstatsync_path">
 * fs.lstatSync</a>
 * @example
 *  var path = require('path');
 *  var dirStatsSync = require('dir-stats-sync');
 *  
 *  var dir = path.resolve(__dirname, 'testData');
 *  
 *  function statCallback (item, stat, dir) {
 *      console.log(stat);
 *  }
 *  
 *  dirStatsSync.lstatDir(dir, statCallback);
 */
module.exports.lstatDir = function lstatDir(dir, callback) {
    'use strict';
    stater(true, dir, callback);
};