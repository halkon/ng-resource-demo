var gulp = require('gulp');
var filter = require('gulp-filter');
var useref = require('gulp-useref');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var plumber = require('gulp-plumber');

gulp.task('html', ['lint', 'templates', 'styles', 'wiredep'], function () {
    var ngFilter = filter('app/scripts/**/*.js');
    var vendorFilter = filter('app/bower_components/**/*.js');
    var cssFilter = filter('**/*.css');

    return gulp.src('app/index.html')
        .pipe(plumber())
        .pipe(useref.assets({ searchPath: './app' }))
        .pipe(ngFilter)
        .pipe(ngAnnotate())
        .pipe(ngFilter.restore())
        .pipe(vendorFilter)
        .pipe(uglify())
        .pipe(vendorFilter.restore())
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(cssFilter.restore())
        .pipe(rev())
        .pipe(useref.restore())
        .pipe(useref())
        .pipe(revReplace())
        .pipe(gulp.dest('./dist/' + global.appName));
});
