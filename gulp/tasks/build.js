var gulp = require('gulp');

gulp.task('build', ['karma:single'], function () {
    gulp.start('clean');
    gulp.start('html');
    gulp.start('images');
});
