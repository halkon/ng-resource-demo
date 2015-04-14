var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('hooks', function () {
  return gulp.src('gulp/hooks/pre-commit')
    .pipe(plugins.symlink(function () {
        return new plugins.symlink.File({
            cwd: process.cwd(),
            path: '.git/hooks/pre-commit'
        });
    }, { force: true }));
});//hooks
