//#! /usr/bin/env node
// see https://npmjs.org/doc/json.html#bin for more info about the bin field of
// package.json

/*jslint white:true,vars:true,node:true,regexp:true,stupid:true */
/**
 * Example showing how to use mustache to transform an entire
 *  directory tree of files.
 * @fileOverview Example showing how to use mustache to transform an entire
 *  directory tree of files.
 * @author <a href="mailto:matthewkastor@gmail.com">Matthew Kastor</a>
 */

// taking the first user supplied arg to this script when called from the
// command line.
var customName = process.argv[2];
var directoryTransform = require('directory-transform');

// Specifying the transform functions to use.
var transformFns = {
    // this transform function will only be called on files
    onFile : function transformFns_onFile (infile, outfile) {
        "use strict";
        // converts the given text to camel case.
        function camelize (str) {
            return str.replace(/[^a-zA-Z0-9_]+./g, function (match) {
                return match[1].toUpperCase();
            });
        }
        
        // using mustache
        var mustache = require('mustache');
        var fs = require('fs');
        var content;
        
        // the mustache view object
        var view = {
            customName : customName
        };
        view.camelizedCustomName = camelize(view.customName);
        
        // try to read the file as utf8 and then run it through mustache.
        // Run the output path through mustache as well - allows using mustaches
        // in file names to generate files with custom names.
        // Then try to write the transformed file with it's custom name.
        // On error, rethrow the error so the stack trace shows a line number
        // that means something useful.
        try {
            content = fs.readFileSync(infile, "utf8");
            content = mustache.render(content, view);
            outfile = mustache.render(outfile, view);
            fs.writeFileSync(outfile, content, {
                flag : 'w',
                mode : fs.statSync(infile).mode
            });
        } catch (err) {
            throw err;
        }
    }
};

directoryTransform(
        './aDirectory/',     // inputDir
        './' + customName,   // outputDir
        transformFns,        // transformFunctions
        true,                // recurse into subdirs
        false                // follow symlinks
    );