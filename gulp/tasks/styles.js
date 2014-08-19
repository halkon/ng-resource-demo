var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');

gulp.task('styles', function () {
  return gulp.src('app/styles/app.less')
        .pipe(less({
            paths: ['app/styles/']
        }))
        .pipe(rename('app.css'))
        .pipe(gulp.dest('app/styles'));
});
