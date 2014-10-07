var gulp = require('gulp');
var symlink = require('gulp-symlink');

gulp.task('hooks', function () {
  return gulp.src('.pre-commit')
    .pipe(symlink('.git/hooks/', 'pre-commit'));
});
