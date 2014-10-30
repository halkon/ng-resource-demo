var gulp = require('gulp');

gulp.task('wiredep:index', function () {
    var wiredep = require('wiredep').stream;
    var wiredepOptions = {
        directory: './app/bower_components'
    };

    return gulp.src('./app/index.html')
        .pipe(wiredep(wiredepOptions))
        .pipe(gulp.dest('./app'));
});//wiredep:index

gulp.task('wiredep:karma', function () {
    var wiredep = require('wiredep').stream;
    var wiredepOptions = {
        directory: './app/bower_components',
        fileTypes: {
            js: {
                block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                detect: {
                    js: /(.*\.js)/g
                },
                replace: {
                    js: '\'{{filePath}}\','
                }
            }
        }
    };

    return gulp.src('./karma.conf.js')
        .pipe(wiredep(wiredepOptions))
        .pipe(gulp.dest('./'));
});//wiredep:karma

gulp.task('wiredep', function () {
    gulp.start('wiredep:index');
    gulp.start('wiredep:karma');
});//wiredep
