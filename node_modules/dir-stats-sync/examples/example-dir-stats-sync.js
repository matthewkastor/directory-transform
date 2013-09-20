var path = require('path');
var dirStatsSync = require('dir-stats-sync');

var dir = path.resolve(__dirname, 'testData');

function lstatCallback (item, stat, dir) {
    console.log(stat);
}

dirStatsSync.lstatDir(dir, lstatCallback);