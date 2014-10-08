var gulp = require('gulp');

gulp.task('build', ['clean', 'karma:build'], function () {
    gulp.start('html');
});
