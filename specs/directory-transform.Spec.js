var directoryTransform = require('../src/directory-transform.js');
var fs = require('fs');
var path = require('path');
var specPath = path.resolve(__dirname, '../browser/tests/directory-transform.test.js');
var specCode = fs.readFileSync(specPath, "utf8");
eval(specCode);
