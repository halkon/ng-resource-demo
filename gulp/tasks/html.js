var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var runSequence = require('run-sequence');

gulp.task('html:assets', ['templates', 'styles', 'images'], function () {
    runSequence('wiredep:index', 'scripts:inject');
});

gulp.task('html', ['html:assets'], function () {
    var assets = useref.assets();

    return gulp.src('app/index.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', csso()))
        .pipe(rev())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revReplace())
        .pipe(gulp.dest('./dist/' + global.appName));
});//html
