var compilePath = global.config.compilePath;
var buildPath = global.config.buildPath;
var bowerPath = global.config.bowerPath;

var csso = require('gulp-csso');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var rm = global.gulpUtil.delete;
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

// clean the buildPath directory
gulp.task('build:clean', function () {
    return gulp.src(buildPath + '/*').pipe(rm());
});//build:clean

gulp.task('build', ['compile', 'build:clean', 'build:images', 'karma:build'], function () {
    var assets = useref.assets();

    return gulp.src(compilePath + '/index.html')
        .pipe(assets) // scripts & stylesheets
        .pipe(gulpif('*.js', uglify())) // minify JS
        .pipe(gulpif('*.css', csso()))  // minify CSS
        .pipe(rev())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(revReplace())
        .pipe(gulp.dest(buildPath));
});//build

// compress/minify all images
gulp.task('build:images', ['compile'], function (done) {
    // Reference for optimization levels:
    // https://github.com/gruntjs/grunt-contrib-imagemin#optimizationlevel-png
    var imageminOptions = {
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    };

    // Encore currently uses relative paths for its images,
    // so they must be served from the same directory as the css.
    // In the future, a CDN may be added, making this part of the task irrelevant.
    gulp.src(bowerPath + '/encore-ui/images/*')
        .pipe(gulp.dest(buildPath + '/styles/images'));

    gulp.src(compilePath + '/images/**/*')
        .pipe(imagemin(imageminOptions))
        .pipe(gulp.dest(buildPath));

    done();
});//build:images

gulp.task('build:docs', ['compile'], function () {
    // TODO: task to build ngdocs in {global.config.docsPath}
});//build:docs
