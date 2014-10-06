var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var ngHtml2Js = require('gulp-ng-html2js');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Convert the html partials into js file pulled in as Angular dependency
gulp.task('templates', function () {
    return gulp.src('./app/views/**/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            stripPrefix: 'app/',
            prefix: 'views/',
            moduleName: global.appName + '.tpls'
        }))
        .pipe(concat('templates.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app/scripts'));
});
