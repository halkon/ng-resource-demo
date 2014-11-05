var gulp = require('gulp');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

gulp.task('build:setup', ['clean', 'templates', 'scripts', 'styles', 'images', 'index']);

gulp.task('build', ['build:setup', 'karma:build'], function () {
    var assets = useref.assets();

    return gulp.src('app/index.html')
        .pipe(assets)
        .pipe(gulpif('*.js', ngAnnotate()))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', csso()))
        .pipe(rev())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revReplace())
        .pipe(gulp.dest('./dist/' + global.appName));
});//build
