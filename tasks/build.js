module.exports = function (grunt) {
    grunt.registerTask('build',
        'Compiles, Lints, and minifies artifacts for deployment',
        [
            'clean:dist',
            'jshint',
            'jscs',
            'useminPrepare',
            'less',
            'concurrent:dist',
            'concat',
            'copy:dist',
            'cssmin',
            'rev',
            'usemin',
            'docs',
            'copy:plato',
            'copyCoverage'
        ]
    );
};
