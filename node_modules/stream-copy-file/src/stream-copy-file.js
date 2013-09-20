/*jslint
    white : true,
    vars : true,
    node : true,
    stupid : true
*/
/**
 * The module object.
 * @namespace The module object.
 * @name module
 */
/**
 * Verbatim file copying using node streams. Like copy /b on windows
 * @param {String} source The name and location of the file to copy.
 * @param {String} target Name and location of the copy.
 * @param {Function} callback The callback is passed an error object if reading
 *  or writing failed.
 * @example
 *  var streamCopyFile = require('stream-copy-file');
 *  var source = 'aFile';
 *  var target = 'bFile';
 *  function callback (err) {
 *      if (err) {
 *          throw err;
 *      }
 *      console.log('files exist, what now?');
 *  }
 *  streamCopyFile(source, target, callback);
 */
module.exports = function streamCopyFile(source, target, callback) {
    'use strict';
    var fs = require('fs');
    var stat = fs.statSync(source);
    if (!(callback instanceof Function)) {
        callback = function default_streamCopyFileCallback () {
            return null;
        };
    }
    var finished = false;
    function done(err) {
        if (!finished) {
            callback(err);
        }
        finished = true;
    }
    var readStream = fs.createReadStream(source, {
            flags: 'r',
            encoding: 'binary',
            fd: null,
            mode: stat.mode,
            autoClose: true
        });
    readStream.on('error', function (err) {
        done(err);
    });
    var writeStream = fs.createWriteStream(target, {
            flags: 'w',
            encoding: 'binary',
            mode: stat.mode
        });
    writeStream.on('error', function (err) {
        done(err);
    });
    writeStream.on('close', function () {
        done();
    });
    readStream.pipe(writeStream);
};
