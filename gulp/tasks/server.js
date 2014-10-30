var gulp = require('gulp');
var concat = require('gulp-concat');
var shell = require('gulp-shell');
var yaml = require('gulp-yaml');
var refresh  = require('gulp-livereload');
var prismInit = global.gulpUtil.prismInit;

// Watch for changes
var watch = function () {
    gulp.watch(['./app/src/**/*.js', './app/index.html'], ['karma:single']);
    gulp.watch(['./app/src/**/*.less'], ['styles']);
    gulp.watch(['./app/src/**/*.html'], ['templates']);
    gulp.watch(['./app/src/**/*']).on('change', refresh.changed);
    gulp.watch('bower.json', ['wiredep']);
};

gulp.task('server', ['open'], function () {
    prismInit('proxy');
    watch();
});

gulp.task('server:stubbed:watch', ['templates', 'styles', 'connect', 'open'], function () {
    gulp.src('test/api-mocks/**/*.yaml')
        .pipe(concat('mocks.yaml'))
        .pipe(yaml({ space: 2 }))
        .pipe(gulp.dest('.'))
        .pipe(shell(['node_modules/stubby/bin/stubby -md mocks.json -l localhost -s 3000']));

    prismInit('stubbed');
    watch();
});

gulp.task('server:mock', ['open'], function () {
    prismInit('mock');
    watch();
});

gulp.task('server:record', ['open'], function () {
    prismInit('record');
    watch();
});
