/*jslint
    white : true,
    vars : true,
    node : true,
    stupid : true
*/
/**
 * @fileOverview A node module for copying directories and running transforms
 *  over file contents, file names, and folder names.
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 */
/**
 * The module.
 * @namespace The module.
 * @name module
 */
/**
 * Copies a directory, running the file contents, file name, and directory names
 *  through user specified transform functions.
 * @param {String} indir The path to the input directory.
 * @param {String} outdir The path to the output directory.
 * @param {Object} [transformFns = see the example below] An object whose
 *  methods are the transformation functions.
 * @param {Function} [transformFns.onFile = see the example below] A function
 *  that receives the path to the input file and the output file. It
 *  is the responsibility of this function to read the input file, perform the
 *  desired transformation, and write that file to the specified output
 *  location. The output directory will exist, so you don't have to check for
 *  that.
 * @param {Function} [transformFns.onDir = see the example below] A function
 *  that takes the path to the next output directory which will be written and
 *  performs a translation on it.
 * @param {Boolean} recurse Set this to true if you want to recurse into
 *  subdirectories.
 * @param {Boolean} followLinks When set to true symlinks will be followed.
 *  This determines whether fs.stat or fs.lstat is used in determining whether
 *  an item in the directory is a file or directory.
 * @example 
 *  // Default transform functions.
 * 
 *  // This is the default set of transformFns. By specifying a transform function
 *  // you will override the defaults. This means that if you do not specify any
 *  // transform functions then the input directory will be copied to the output
 *  // directory.
 *  var defaultTransformFns = {
 *              onFile: function defaultTransformFns_onFile(infile, outfile) {
 *                  var streamCopyFile = require('stream-copy-file');
 *                  streamCopyFile(infile, outfile, function (err) {
 *                      if (err) {
 *                          console.log(err);
 *                      }
 *                  });
 *              },
 *              onDir: function defaultTransformFns_onDir(dir) {
 *                  return dir;
 *              }
 *          };
 * @example
 *  // Transforming a directory recursively using mustache.
 * 
 *  // this example is in the examples directory with plenty of comments.
 *  var customName = process.argv[2];
 *  var directoryTransform = require('directory-transform');
 *  var transformFns = {
 *      onFile : function transformFns_onFile (infile, outfile) {
 *          "use strict";
 *          function camelize (str) {
 *              return str.replace(/[^a-zA-Z0-9_]+./g, function (match) {
 *                  return match[1].toUpperCase();
 *              });
 *          }
 *          var mustache = require('mustache');
 *          var fs = require('fs');
 *          var content;
 *          var view = {
 *              customName : customName
 *          };
 *          view.camelizedCustomName = camelize(view.customName);
 *          try {
 *              content = fs.readFileSync(infile, "utf8");
 *              content = mustache.render(content, view);
 *              outfile = mustache.render(outfile, view);
 *              fs.writeFileSync(outfile, content, {
 *                  flag : 'w',
 *                  mode : fs.statSync(infile).mode
 *              });
 *          } catch (err) {
 *              throw err;
 *          }
 *      }
 *  };
 *  directoryTransform(
 *          './aDirectory/',
 *          './' + customName,
 *          transformFns,
 *          true,
 *          false
 *      );
 */
module.exports = function directoryTransform(indir, outdir, transformFns, recurse, followLinks) {
    'use strict';
    var defaultTransformFns = {
            onFile: function defaultTransformFns_onFile(infile, outfile) {
                var streamCopyFile = require('stream-copy-file');
                streamCopyFile(infile, outfile, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            },
            onDir: function defaultTransformFns_onDir(dir) {
                return dir;
            }
        };
    // mandatory args
    if (!indir) {
        throw new Error('indir must be specified');
    }
    if (!outdir) {
        throw new Error('outdir must be specified');
    }
    // optional args
    transformFns = transformFns || defaultTransformFns;
    Object.keys(defaultTransformFns).forEach(function (fn) {
        if (!(transformFns[fn] instanceof Function)) {
            transformFns[fn] = defaultTransformFns[fn];
        }
    });
    recurse = !!recurse;
    // coerce boolean
    var statType = followLinks ? 'statDir' : 'lstatDir';
    var fs, path, resolved;
    try {
        fs = require('fs');
        path = require('path');
        resolved = {
            indir: path.resolve(indir),
            outdir: path.resolve(outdir)
        };
        if (resolved.indir === resolved.outdir) {
            throw new Error('indir and outdir can not refer to the same location');
        }
        try {
            fs.mkdirSync(resolved.outdir, fs.statSync(indir).mode);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
        var dirStatsSync = require('dir-stats-sync');
        dirStatsSync[statType](resolved.indir, function (file, stat) {
            var infile = path.resolve(resolved.indir, file);
            var outfile = path.resolve(resolved.outdir, file);
            if (stat.isDirectory() && recurse === true) {
                outfile = transformFns.onDir(outfile);
                directoryTransform(infile, outfile, transformFns, recurse);
            }
            if (stat.isFile()) {
                transformFns.onFile(infile, outfile);
            }
        });
    } catch (err) {
        throw err;
    }
};