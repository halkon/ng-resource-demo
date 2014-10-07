var gulp = require('gulp');

gulp.task('build', ['karma:build'], function () {
    gulp.start('clean');
    gulp.start('html');
    gulp.start('images');
});
