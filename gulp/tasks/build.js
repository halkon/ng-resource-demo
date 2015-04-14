var compilePath = global.config.compilePath;
var buildPath = global.config.buildPath;
var bowerPath = global.config.bowerPath;

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var rm = global.gulpUtil.delete;

// clean the buildPath directory
gulp.task('build:clean', function () {
    return gulp.src(buildPath + '/*').pipe(rm());
});//build:clean

gulp.task('build', ['compile:build', 'build:clean', 'build:images', 'karma:build'], function () {
    var assets = plugins.useref.assets();

    return gulp.src(compilePath + '/index.html')
        .pipe(assets) // scripts & stylesheets
        .pipe(plugins.if('*.js', plugins.uglify())) // minify JS
        .pipe(plugins.if('*.css', plugins.csso()))  // minify CSS
        .pipe(plugins.rev())
        .pipe(assets.restore())
        .pipe(plugins.useref())
        .pipe(plugins.revReplace())
        .pipe(gulp.dest(buildPath));
});//build

// compress/minify all images
gulp.task('build:images', ['compile:build'], function (done) {
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
        .pipe(plugins.imagemin(imageminOptions))
        .pipe(gulp.dest(buildPath));

    done();
});//build:images

gulp.task('build:docs', ['compile:build'], function () {
    // TODO: task to build ngdocs in {global.config.docsPath}
});//build:docs
