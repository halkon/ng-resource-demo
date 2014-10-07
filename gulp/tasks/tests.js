var gulp = require('gulp');
var karma = require('karma').server;
var _ = require('lodash');

// Run test once and exit
gulp.task('karma:single', ['lint'], function (done) {
    karma.start(_.assign({}, { singleRun: true, configFile: process.cwd() + '/karma.conf.js' }), done);
});

// Watch for file changes and re-run tests on each change
gulp.task('karma:watch', function (done) {
    karma.start(_.assign({}, { configFile: process.cwd() + '/karma.conf.js' }), done);
});

// Run Karma using the threshold reporter
gulp.task('karma:threshold', ['lint'], function (done) {
    karma.start(_.assign(
        { reporters: ['coverage', 'threshold'] },
        { singleRun: true, configFile: process.cwd() + '/karma.conf.js' }), done);
});

// Only run during builds -- fails on lint and unit test errors
gulp.task('karma:build', ['lint:fail'], function (done) {
    karma.start(_.assign({}, { singleRun: true, configFile: process.cwd() + '/karma.conf.js' }), done);
});
