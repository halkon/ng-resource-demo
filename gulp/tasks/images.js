var pkg = require('../../package.json');
var appName = pkg.config.appName;
var gulp = require('gulp');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

// Reference for optimization levels: https://github.com/gruntjs/grunt-contrib-imagemin#optimizationlevel-png

var imgDest = './dist/' + appName + '/images';

gulp.task('images', function () {
    return gulp.src(['app/images/**/*', 'app/bower_components/encore-ui/images/**/*'])
        .pipe(newer(imgDest))
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(imgDest));
});
