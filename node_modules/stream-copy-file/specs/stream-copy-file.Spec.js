/*jslint
    white : true,
    vars : true,
    node : true,
    stupid : true,
    nomen : true
*/
/*globals
    describe,
    it,
    afterEach,
    runs,
    waitsFor,
    expect
*/
describe('stream-copy-file', function () {
    "use strict";
    var streamCopyFile = require('../src/stream-copy-file.js');
    var fs = require('fs');
    var path = require('path');
    var source = path.resolve(__dirname, __filename);
    var target = path.resolve(__dirname, 'tmp');
    
    var ready = false;
    function callback (err) {
        if (err) {
            throw err;
        }
        ready = true;
    }
    
    function should_copy_files () {
        runs(function () {
            streamCopyFile(source, target, callback);
        });

        waitsFor(function () {
            return ready;
        }, 'did not copy the file', 1000);

        runs(function () {
            expect(
                fs.readFileSync(source, 'utf8')
            ).toEqual(
                fs.readFileSync(target, 'utf8')
            );
        });
    }
    
    afterEach(function () {
        fs.unlinkSync(target);
        ready = false;
    });
    
    it('should copy files', should_copy_files);
});