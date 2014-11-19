var prismInit = global.gulpUtil.prismInit;
var testPath = global.config.testPath;

var concat = require('gulp-concat');
var gulp = require('gulp');
var shell = require('gulp-shell');
var yaml = require('gulp-yaml');

gulp.task('server', ['open', 'watch'], function () {
    prismInit('proxy');
});

gulp.task('server:stubbed:watch', ['open', 'watch'], function () {
    gulp.src(testPath + '/api-mocks/**/*.yaml')
        .pipe(concat('mocks.yaml'))
        .pipe(yaml({ space: 2 }))
        .pipe(gulp.dest('.'))
        .pipe(shell(['node_modules/stubby/bin/stubby -md mocks.json -l localhost -s 3000']));

    prismInit('stubbed');
});

gulp.task('server:mock', ['open', 'watch'], function () {
    prismInit('mock');
});

gulp.task('server:record', ['open', 'watch'], function () {
    prismInit('record');
});
