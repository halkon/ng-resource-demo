var prismInit = global.gulpUtil.prismInit;
var testPath = global.config.testPath;

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('server', ['open', 'watch', 'dpd'], function () {
    prismInit('proxy');
});

gulp.task('server:stubbed:watch', ['open', 'watch'], function () {
    gulp.src(testPath + '/api-mocks/**/*.yaml')
        .pipe(plugins.concat('mocks.yaml'))
        .pipe(plugins.yaml({ space: 2 }))
        .pipe(gulp.dest('.'))
        .pipe(plugins.shell(['node_modules/.bin/stubby -md mocks.json -l localhost -s 3000']));

    prismInit('stubbed');
});//server:stubbed:watch

gulp.task('server:mock', ['open', 'watch'], function () {
    prismInit('mock');
});

gulp.task('server:record', ['open', 'watch'], function () {
    prismInit('record');
});
