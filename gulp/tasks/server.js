var prismInit = global.gulpUtil.prismInit;

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('server', ['open', 'dpd', 'watch'], function () {
    prismInit('proxy');
});

gulp.task('server:local', ['open', 'watch'], function () {
    prismInit('proxy', true);
});

var startStubby = function () {
    gulp.src('').pipe(plugins.shell(['node_modules/stubby/bin/stubby -mw -d mocks.json -l localhost -s 3000']));

    prismInit('stubbed');
};

gulp.task('server:stubbed', ['open', 'build:mocks', 'watch'], function () {
    startStubby();
});//server:stubbed

gulp.task('server:build:stubbed', ['open:build', 'build:mocks', 'watch'], function () {
    startStubby();
});//server:build:stubbed

gulp.task('server:jenkins', ['build:mocks', 'connect:build'], function () {
    startStubby();
});//server:jenkins

gulp.task('server:prod', ['dpd', 'connect:prod'], function () {
    prismInit('proxy');
});
