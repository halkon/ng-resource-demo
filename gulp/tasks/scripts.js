var gulp = require('gulp');
var injector = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');

gulp.task('scripts', ['scripts:transpile']);

gulp.task('scripts:inject', function () {
    var sourcePaths = [
        './app/src/**/*.js',
        '!./app/src/**/*.spec.js',
        '!./app/src/app.js'
    ];
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(sourcePaths, { read: false }).pipe(angularFilesort());

    return gulp.src('./app/index.html')
        .pipe(injector(sources, { ignorePath: 'app', addRootSlash: false }))
        .pipe(gulp.dest('./app'));
});//scripts:inject

gulp.task('scripts:transpile', function () {
    // If required, place your transpiling logic here
    // * Coffeescript -> ES5 Javascript
    // * Typescript -> ES5 Javascript
    // * ES6 Javascript -> ES5 Javascript
});//scripts:transpile
