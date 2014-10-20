var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');

gulp.task('styles', function () {
    // Concatenation occurs in the same order
    var lessPaths = [
        'app/src/app.less',
        'app/src/common/**/*.less',
        'app/src/**/*.less'
    ];

    return gulp.src(lessPaths)
        .pipe(less())
        .pipe(concat('application.css'))
        .pipe(gulp.dest('app'));
});//styles
