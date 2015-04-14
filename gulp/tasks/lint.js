var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');

var srcPath = global.config.srcPath;

var lintPaths = [
    srcPath + '/src/**/*.js',
    './gulp/tasks/*.js',
    './test/**/*.js'
];

// JSHint and jscs
gulp.task('lint', function () {
    return gulp.src(lintPaths)
        .pipe(plugins.plumber()) // Handle errors to prevent exit of Gulp process
        .pipe(plugins.jscs())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish)) // Console output
        .pipe(plugins.jshint.reporter('fail')); // Fail on errors
});//lint

gulp.task('lint:strict', function () {
    return gulp.src(lintPaths)
        .pipe(plugins.jscs())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter(stylish)) // Console output
        .pipe(plugins.jshint.reporter('fail')); // Fail on errors
});//lint:strict
