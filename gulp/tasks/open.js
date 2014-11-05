var gulp = require('gulp');

gulp.task('open', ['lint', 'templates', 'index', 'styles', 'connect'], function () {
    require('opn')('http://localhost:9000/' + global.appName);
});
