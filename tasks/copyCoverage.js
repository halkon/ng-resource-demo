var fs  = require('fs-extra'),
    _   = require('lodash'),
    config = require('./util/config.js');

module.exports = function (grunt) {
    grunt.registerTask('copyCoverage',
        'Copies coverage report into dist directory with a common name',

        function() {
            var dirs = fs.readdirSync('coverage');
            var dest = config.appDest + '/coverage';

            var dir = _.find(dirs, function (file) {
                return grunt.file.isDir('coverage/' + file);
            });

            fs.mkdirsSync(dest);
            fs.copySync('coverage/' + dir, dest);
        }
    );
};
