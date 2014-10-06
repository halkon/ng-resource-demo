var gulp = require('gulp');

gulp.task('build', ['clean'], function () {
    gulp.start('html');
    gulp.start('images');
});
