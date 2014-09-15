/*jshint node:true*/
var fs = require('fs');

module.exports = function (grunt) {
    grunt.registerTask('hooks', function () {
        // don't run the command if we're in Travis CI
        if (!process.env.TRAVIS) {
            // go into git-hooks directory and copy over every file
            grunt.file.recurse('tasks/git-hooks', function (abspath, rootdir, subdir, filename) {
                var gitPath = '.git/hooks/' + filename;

                // copy the hook file to the correct place in the .git directory
                grunt.file.copy(abspath, gitPath);

                // chmod the files to readable and executable by all
                fs.chmodSync(gitPath, '755');
            });
        }
    });
};

