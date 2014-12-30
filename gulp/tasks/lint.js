var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var srcPath = global.config.srcPath;

var lintPaths = [
    srcPath + '/src/**/*.js',
    './gulp/tasks/*.js'
];

// JSHint and jscs
gulp.task('lint', function () {
    return gulp.src(lintPaths)
        .pipe(plumber()) // Handle errors to prevent exit of Gulp process
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish)) // Console output
        .pipe(jshint.reporter('fail')); // Fail on errors
});//lint

gulp.task('lint:strict', function () {
    return gulp.src(lintPaths)
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish)) // Console output
        .pipe(jshint.reporter('fail')); // Fail on errors
});//lint:strict
