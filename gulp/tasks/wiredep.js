var gulp = require('gulp');
var injector = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');

// inject bower components into index.html
gulp.task('wiredep:index', function () {
    var wiredep = require('wiredep').stream;
    var wiredepOptions = {
        directory: './app/bower_components'
    };

    return gulp.src('./app/index.html')
        .pipe(wiredep(wiredepOptions))
        .pipe(gulp.dest('./app'));
});//wiredep:index

// inject bower components into Karma
gulp.task('wiredep:karma', function () {
    var wiredep = require('wiredep').stream;
    var wiredepOptions = {
        directory: './app/bower_components',
        fileTypes: {
            js: {
                block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                detect: {
                    js: /(.*\.js)/g
                },
                replace: {
                    js: '\'{{filePath}}\','
                }
            }
        }
    };

    return gulp.src('./karma.conf.js')
        .pipe(wiredep(wiredepOptions))
        .pipe(gulp.dest('./'));
});//wiredep:karma

// inject Angular scripts into index.html
gulp.task('index', function () {
    var target = gulp.src('./app/index.html');
    var sourcePaths = [
        './app/src/**/*.js',
        '!./app/src/**/*.spec.js',
        '!./app/src/app.js'
    ];
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(sourcePaths, { read: false }).pipe(angularFilesort());

    return target.pipe(injector(sources, { ignorePath: 'app', addRootSlash: false }))
        .pipe(gulp.dest('./app'));
});//index

gulp.task('wiredep', function () {
    gulp.start('wiredep:index');
    gulp.start('wiredep:karma');
    gulp.start('index');
});//wiredep
