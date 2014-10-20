var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var lintPaths = [
    './app/src/**/*.js',
    './gulp/tasks/*.js'
];

// JSHint and jscs
gulp.task('lint', function () {
    return gulp.src(lintPaths)
        .pipe(plumber())
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish)); // Console output
});//lint

gulp.task('lint:strict', function () {
    return gulp.src(lintPaths)
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish)) // Console output
        .pipe(jshint.reporter('fail')); // Fail on errors
});//lint:strict
