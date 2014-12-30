var appName = global.config.appName;
var bowerPath = global.config.bowerPath;
var compilePath = global.config.compilePath;
var del = global.gulpUtil.delete;
var srcPath = global.config.srcPath;

var angularFilesort = require('gulp-angular-filesort');
var concat = require('gulp-concat');
var gulp = require('gulp');
var injector = require('gulp-inject');
var less = require('gulp-less');
var minifyHtml = require('gulp-minify-html');
var newer = require('gulp-newer');
var ngAnnotate = require('gulp-ng-annotate');
var ngHtml2Js = require('gulp-ng-html2js');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var wiredep = require('wiredep').stream;

// Clean up the /compiled directory
gulp.task('compile:clean', function () {
    var sources = [
        compilePath + '/*',
        '!' + bowerPath
    ];
    return gulp.src(sources).pipe(del());
});//compile:clean

// gather all src images into /compiled/images
gulp.task('compile:images', function () {
    var imgDest = compilePath + '/src';

    return gulp.src(srcPath + '/src/**/images/**/*')
        .pipe(newer(imgDest)) // filter newer files
        .pipe(gulp.dest(imgDest));
});//compile:images

gulp.task('compile:fonts', function () {
    var fontDest = compilePath + '/src';

    return gulp.src(srcPath + '/src/**/fonts/**/*')
        .pipe(newer(fontDest)) // filter newer files
        .pipe(gulp.dest(fontDest));
});//compile:fonts

// Place your (pre)compiling/transpiling logic here
gulp.task('compile:scripts', function () {
    return gulp.src(srcPath + '/src/**/*.js')
        .pipe(plumber())
        .pipe(newer(compilePath + '/src')) // filter newer files
        .pipe(ngAnnotate())
        .pipe(gulp.dest(compilePath + '/src'));
});//compile:scripts

// Inject Bower components and Scripts from {srcPath}/index.html into {compilePath}/index.html
gulp.task('compile:index', function () {
    // script injection
    var scriptSourcePaths = [
        srcPath + '/src/**/*.js',
        '!' + srcPath + '/src/**/*.spec.js',
        '!' + srcPath + '/src/app.js'
    ];
    var scriptSources = gulp.src(scriptSourcePaths).pipe(angularFilesort());

    return gulp.src(srcPath + '/index.html')
        .pipe(gulp.dest(compilePath))
        .pipe(wiredep({ directory: bowerPath }))
        .pipe(injector(scriptSources, { ignorePath: 'app', addRootSlash: false }))
        .pipe(gulp.dest(compilePath));
});//compile:index

// compile LESS to {compilePath}/application.css
gulp.task('compile:styles', function () {
    return gulp.src(srcPath + '/src/app.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(concat('application.css'))
        .pipe(gulp.dest(compilePath));
});//compile:styles

// compile all src HTML files into ng-friendly {compilePath}/templates.js
gulp.task('compile:templates', function () {
    var minifyHtmlOptions = {
        empty: true,
        spare: true,
        quotes: true
    };
    var ngHtml2JsOptions = {
        stripPrefix: 'app/',
        prefix: 'src/',
        moduleName: appName + '.tpls'
    };

    return gulp.src(srcPath + '/src/**/*.html')
        .pipe(minifyHtml(minifyHtmlOptions))
        .pipe(ngHtml2Js(ngHtml2JsOptions))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(compilePath));
});//compile:templates

gulp.task('compile', ['lint'], function (cb) {
    runSequence([
        'compile:fonts',
        'compile:images',
        'compile:index',
        'compile:scripts',
        'compile:styles',
        'compile:templates'
    ], cb);
});//compile

gulp.task('compile:build', ['lint:strict'], function (cb) {
    // run compile:clean before everything else
    runSequence('compile:clean', [
        'compile:fonts',
        'compile:images',
        'compile:index',
        'compile:scripts',
        'compile:styles',
        'compile:templates'
    ], cb);
});//compile:clean
