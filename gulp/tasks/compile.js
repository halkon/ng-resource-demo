var appName = global.config.appName;
var bowerPath = global.config.bowerPath;
var compilePath = global.config.compilePath;
var del = global.gulpUtil.delete;
var srcPath = global.config.srcPath;

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var wiredep = require('wiredep').stream;

var compilationTasks = [
    'compile:fonts',
    'compile:images',
    'compile:index',
    'compile:scripts',
    'compile:styles',
    'compile:templates'
];

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
        .pipe(plugins.newer(imgDest)) // filter newer files
        .pipe(gulp.dest(imgDest));
});//compile:images

gulp.task('compile:fonts', function () {
    var fontDest = compilePath + '/src';

    return gulp.src(srcPath + '/src/**/fonts/**/*')
        .pipe(plugins.newer(fontDest)) // filter newer files
        .pipe(gulp.dest(fontDest));
});//compile:fonts

// Place your (pre)compiling/transpiling logic here
gulp.task('compile:scripts', function () {
    return gulp.src(srcPath + '/src/**/*.js')
        .pipe(plugins.plumber())
        .pipe(plugins.newer(compilePath + '/src')) // filter newer files
        .pipe(plugins.ngAnnotate())
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
    var scriptSources = gulp.src(scriptSourcePaths).pipe(plugins.angularFilesort());

    return gulp.src(srcPath + '/index.html')
        .pipe(gulp.dest(compilePath))
        .pipe(wiredep({ directory: bowerPath }))
        .pipe(plugins.inject(scriptSources, { ignorePath: 'app', addRootSlash: false }))
        .pipe(gulp.dest(compilePath));
});//compile:index

// compile LESS to {compilePath}/application.css
gulp.task('compile:styles', function () {
    return gulp.src(srcPath + '/src/app.less')
        .pipe(plugins.plumber(function (err) {
            plugins.util.log(err.message);
            this.emit('end');
        }))
        .pipe(plugins.less())
        .pipe(plugins.concat('application.css'))
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
        .pipe(plugins.minifyHtml(minifyHtmlOptions))
        .pipe(plugins.ngHtml2js(ngHtml2JsOptions))
        .pipe(plugins.concat('templates.js'))
        .pipe(gulp.dest(compilePath));
});//compile:templates

gulp.task('compile', ['lint'], function (cb) {
    runSequence(compilationTasks, cb);
});//compile

gulp.task('compile:build', ['lint:strict'], function (cb) {
    // run compile:clean before everything else
    runSequence('compile:clean', compilationTasks, cb);
});//compile:build
