var gulp = require('gulp');
var symlink = require('gulp-symlink');

gulp.task('hooks', function () {
  return gulp.src('gulp/hooks/pre-commit')
    .pipe(symlink(function () {
        return new symlink.File({
            cwd: process.cwd(),
            path: '.git/hooks/pre-commit'
        });
    }, { force: true }));
});//hooks
