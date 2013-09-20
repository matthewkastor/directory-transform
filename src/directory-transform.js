/*jslint
    white : true,
    vars : true,
    node : true,
    stupid : true
*/
function directoryTransform(indir, outdir, transformFns, recurse, followLinks) {
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
}
module.exports = directoryTransform;