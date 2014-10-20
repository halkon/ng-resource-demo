var gulp = require('gulp');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

// Reference for optimization levels: https://github.com/gruntjs/grunt-contrib-imagemin#optimizationlevel-png

gulp.task('images', function () {
    var imgDest = './dist/' + global.appName + '/images';
    var imagePaths = [
        'app/src/**/images/**/*',
        'app/bower_components/encore-ui/images/**/*'
    ];
    var imageminOptions = {
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    };

    return gulp.src(imagePaths)
        .pipe(newer(imgDest))
        .pipe(imagemin(imageminOptions))
        .pipe(gulp.dest(imgDest));
});//images
