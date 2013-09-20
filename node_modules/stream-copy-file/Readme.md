# stream-copy-file

Node module to copy files like copy /b on windows.

## Installation

```
npm install stream-copy-file
```

## Usage

Copy a file then call a callback.

```
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
```
