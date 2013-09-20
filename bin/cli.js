#!/usr/bin/env node
var directoryTransform = require('../src/directory-transform.js');
var argz = Array.prototype.slice.call(process.argv);
console.log(directoryTransform.apply(argz));