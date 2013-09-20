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
    expect
*/
describe('directory-transform', function () {
    "use strict";
    var directoryTransform = require('../src/directory-transform');
    var fixtureVars = {
        itemName : 'a-item',
        itemContents : 'file-contents'
    };
    function camelize (str) {
        return str.replace(/[^a-zA-Z0-9_]+./g, function (match) {
            return match[1].toUpperCase();
        });
    }
    var transformFns = {
        onFile : function transformFns_onFile (infile, outfile) {
            var fs = require('fs');
            var content;
            try {
                content = fs.readFileSync(infile, "utf8");
                content = camelize(content);
                outfile = camelize(outfile);
                fs.writeFileSync(outfile, content, {
                    flag : 'w',
                    mode : fs.statSync(infile).mode
                });
            } catch (err) {
                throw err;
            }
        },
        onDir : function transformFns_onDir (dir) {
            return camelize(dir);
        }
    };
    
    function getPaths (itemName) {
        var path = require('path');
        var itemPath = path.resolve(__dirname, itemName); // ./a-item
        var subItemPath = path.resolve(itemPath, itemName); // ./a-item/a-item
        var camelizedItemPath = camelize(itemPath);
        var camelizedSubItemPath = camelize(subItemPath);
        return {
            itemPath : itemPath,
            subItemPath : subItemPath,
            camelizedItemPath : camelizedItemPath,
            camelizedSubItemPath : camelizedSubItemPath
        };
    }
    
    function createTestData (itemName, contents) {
        var fs = require('fs');
        var paths = getPaths(itemName);
        fs.writeFileSync(paths.itemPath, contents);
        fs.mkdirSync(paths.itemPath);
        fs.writeFileSync(paths.subItemPath, contents);
    }
    
    function destroyTestData (itemName) {
        var fs = require('fs');
        var paths = getPaths(itemName);
        fs.unlinkSync(paths.itemPath);
        fs.unlinkSync(paths.subItemPath);
        fs.rmdirSync(paths.itemName);
        fs.unlinkSync(paths.camelizedItemPath);
        fs.unlinkSync(paths.camelizedSubItemPath);
        fs.rmdirSync(paths.camelizedItemName);
    }
    
    beforeEach(function () {
        try {
            destroyTestData(fixtureVars.itemName);
        } catch (ignore) {
            // the data isn't supposed to exist, just destroying in case of
            // previous test failure.
        }
        try {
            createTestData(fixtureVars.itemName, fixtureVars.itemContents);
        } catch (e) {
            console.log(e);
            throw new Error('could not create test data');
        }
    });
    /*
    afterEach(function () {
        try {
            destroyTestData(fixtureVars.itemName);
        } catch (e) {
            console.log(e);
            throw new Error('could not destroy test data');
        }
    });
    it('must default to a single level copy operation', function () {
    
    });
    it('must recursively copy', function () {
    
    });
    it('must transform file contents, names, and directory names', function () {
    
    });
    
    
    directoryTransform(
        './aDirectory/',
        './' + customName,
        transformFns,
        true,
        false
    );
    */
});

