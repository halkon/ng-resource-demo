var gulp = require('gulp');
var symlink = require('gulp-symlink');

gulp.task('hooks', function () {
  return gulp.src('gulp/hooks/pre-commit')
    .pipe(symlink('.git/hooks'));
});
