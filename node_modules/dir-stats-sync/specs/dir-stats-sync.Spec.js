describe('dir-stat-sync', function () {
    var fs = require('fs');
    var path = require('path');
    var dirStatsSync = require('../src/dir-stats-sync.js');
    var dir = path.resolve(__dirname, 'testData');
    
    function fixture () {
        var data = {
            stat : {},
            lstat : {}
        };
        
        function lstatCallback (item, stat, dir) {
            data.lstat[item] = stat;
        }
        dirStatsSync.lstatDir(dir, lstatCallback);
        
        function statCallback (item, stat, dir) {
            data.stat[item] = stat;
        }
        dirStatsSync.statDir(dir, statCallback);
        return data;
    }
    
    var data = fixture();
    
    describe('statDir', function () {
        it('should stat each item in a directory', function () {
            expect(data.stat.folder.isDirectory()).toEqual(true);
            expect(data.stat.textFile.isFile()).toEqual(true);
        });
    });
    
    describe('lstatDir', function () {
        it('should stat each item in a directory', function () {
            expect(data.lstat.folder.isDirectory()).toEqual(true);
            expect(data.lstat.textFile.isFile()).toEqual(true);
        });
    });
    
});
