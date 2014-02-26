module.exports = function (grunt) {
    grunt.registerTask('styleguide', function () {
        grunt.log.writeln('Generating CSS style guide');

        this.async();

        var styledocco = require('../node_modules/styledocco/cli.js');

        styledocco(this.options());
    });
};