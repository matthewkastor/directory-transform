/*jslint
    white: true,
    vars: true,
    node: true,
    stupid: true,
    regexp: true,
    nomen: true
*/
/*globals
    describe,
    beforeEach,
    afterEach,
    it,
    expect,
    runs,
    waitsFor,
*/
"use strict";
var directoryTransform = require('../src/directory-transform');
var fs = require('fs');
var path = require('path');

function camelize (str) {
    return str.replace(/[^a-zA-Z0-9_]+./g, function (match) {
        return match[1].toUpperCase();
    });
}
var transformFns = {
    onFile : function transformFns_onFile (infile, outfile) {
        var content;
        try {
            content = fs.readFileSync(infile, "utf8");
            content = camelize(content);
            outfile = outfile.replace(/a\-item/g, 'aItem');
            fs.writeFileSync(outfile, content, {
                flag : 'w',
                mode : fs.statSync(infile).mode
            });
        } catch (err) {
            throw err;
        }
    },
    onDir : function transformFns_onDir (dir) {
        return dir.replace(/a\-item/g, 'aItem');
    }
};
function exists (pathRelativeTo__dirname) {
    return fs.existsSync(path.resolve(__dirname, pathRelativeTo__dirname));
}
function deleteFile (pathRelativeTo__dirname) {
    fs.unlinkSync(path.resolve(__dirname, pathRelativeTo__dirname));
}
function deleteDir (pathRelativeTo__dirname) {
    fs.rmdirSync(path.resolve(__dirname, pathRelativeTo__dirname));
}
function deleteTree (pathRelativeTo__dirname) {
    var where = path.resolve(__dirname, pathRelativeTo__dirname);
    var files = fs.readdirSync(where);
    files.forEach(function (file) {
        var fileLoc = path.resolve(where, file);
        if (fs.statSync(fileLoc).isDirectory()) {
            deleteTree(path.relative(__dirname, fileLoc));
        } else {
            deleteFile(path.relative(__dirname, fileLoc));
        }
    });
    deleteDir(pathRelativeTo__dirname);
}

describe('setup', function () {
    it('must create the specs/tmp folder', function () {
        runs(function () {
            if(exists('tmp')) {
                deleteTree('tmp');
            }
        });
        waitsFor(function () {
            return exists('tmp') === false;
        }, 'old specs/tmp must be deleted.', 3000);
        runs(function () {
            fs.mkdirSync(path.resolve(__dirname, 'tmp'));
            expect(exists('tmp')).toEqual(true);
        });
    });
});

describe('directory-transform', function () {
    it('must default to copying only files from indir', function () {
        runs(function () {
            directoryTransform(
                path.resolve(__dirname, 'testData'), // input dir
                path.resolve(__dirname, 'tmp/1')       // output dir
            );
        });
        
        waitsFor(function () {
            return exists('tmp/1/a-item.txt');
        }, 'waiting for specs/tmp/1/a-item.txt to exist', 2000);
        
        runs(function () {
            expect(exists('tmp/1/a-item.txt')).toEqual(true);
            expect(exists('tmp/1/a-item')).toEqual(false);
        });
    });
    it('must recursively copy', function () {
        runs(function () {
            directoryTransform(
                path.resolve(__dirname, 'testData'), // input dir
                path.resolve(__dirname, 'tmp/2'),      // output dir
                null,                                // transform functions
                true,                                // recurse
                false                                // follow symlinks
            );
        });
        
        waitsFor(function () {
            return exists('tmp/2/a-item/a-item.txt') && exists('tmp/2/a-item.txt');
        }, 'waiting for specs/tmp/2/a-item/a-item.txt to exist', 2000);
        
        runs(function () {
            expect(exists('tmp/2/a-item.txt')).toEqual(true);
            expect(exists('tmp/2/a-item/a-item.txt')).toEqual(true);
        });
    });
    it('must transform file contents, names, and directory names', function () {
        runs(function () {
            directoryTransform(
                path.resolve(__dirname, 'testData'), // input dir
                path.resolve(__dirname, 'tmp/3'),    // output dir
                transformFns,                        // transform functions
                true,                                // recurse
                false                                // follow symlinks
            );
        });
        
        waitsFor(function () {
            return exists('tmp/3/aItem/aItem.txt') && exists('tmp/3/aItem.txt');
        }, 'waiting for specs/tmp/3/aItem/aItem.txt to exist', 2000);
        
        runs(function () {
            var content = fs.readFileSync(
                    path.resolve(__dirname, 'tmp/3/aItem/aItem.txt'),
                    'utf8'
                );
            expect(exists('tmp/3/aItem.txt')).toEqual(true);
            expect(exists('tmp/3/aItem/aItem.txt')).toEqual(true);
            expect(content).toEqual('fileContent');
        });
    });
    
    deleteTree('tmp');
});
