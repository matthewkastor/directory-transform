# directory-transform

A node module for copying directories and running transforms over file contents,
 file names, and folder names.

## Installation

```
npm install directory-transform
```

## Usage

In node:

```
// Transforming a directory recursively using mustache.

// this example is in the examples directory with plenty of comments.
var customName = process.argv[2];
var directoryTransform = require('directory-transform');
var transformFns = {
    onFile : function transformFns_onFile (infile, outfile) {
        "use strict";
        function camelize (str) {
            return str.replace(/[^a-zA-Z0-9_]+./g, function (match) {
                return match[1].toUpperCase();
            });
        }
        var mustache = require('mustache');
        var fs = require('fs');
        var content;
        var view = {
            customName : customName
        };
        view.camelizedCustomName = camelize(view.customName);
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
        './aDirectory/',
        './' + customName,
        transformFns,
        true,
        false
    );
```

Full documentation is available in the docs folder.
