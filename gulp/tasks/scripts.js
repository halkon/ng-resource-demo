var gulp = require('gulp');
var injector = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');

gulp.task('scripts:inject', function () {
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
});//scripts:inject
