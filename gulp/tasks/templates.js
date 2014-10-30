var gulp = require('gulp');
var minifyHtml = require('gulp-minify-html');
var ngHtml2Js = require('gulp-ng-html2js');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Convert the html partials into js file pulled in as Angular dependency
gulp.task('templates', function () {
    var templatePaths = [
        './app/src/**/*.html'
    ];
    var minifyHtmlOptions = {
        empty: true,
        spare: true,
        quotes: true
    };
    var ngHtml2JsOptions = {
        stripPrefix: 'app/',
        prefix: 'modules/',
        moduleName: global.appName + '.tpls'
    };

    return gulp.src(templatePaths)
        .pipe(minifyHtml(minifyHtmlOptions))
        .pipe(ngHtml2Js(ngHtml2JsOptions))
        .pipe(concat('templates.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./app'));
});//templates
