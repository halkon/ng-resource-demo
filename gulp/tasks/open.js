var gulp = require('gulp');
var opn = require('opn');

gulp.task('open', ['compile', 'connect'], function () {
    opn('http://localhost:9000' + global.config.baseHref);
});
