var streamCopyFile = require('stream-copy-file');
var source = 'aFile';
var target = 'bFile';
function callback (err) {
    if (err) {
        throw err;
    }
    console.log('files exist, what now?');
}
streamCopyFile(source, target, callback);
