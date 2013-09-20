# dir-stats-sync

Node module to get stats of every item in a directory

## Installation

```
npm install dir-stats-sync
```

## Usage

```
var path = require('path');
var dirStatsSync = require('dir-stats-sync');

var dir = path.resolve(__dirname, 'testData');

function statCallback (item, stat, dir) {
    console.log(stat);
}

dirStatsSync.statDir(dir, lstatCallback);
```
