var gulp = require('gulp');
var injector = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');

// inject bower components into index.html
gulp.task('wiredep:index', function () {
    var wiredep = require('wiredep').stream;
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: './app/bower_components'
        }))
        .pipe(gulp.dest('./app'));
});

// inject bower components into Karma
gulp.task('wiredep:karma', function () {
    var wiredep = require('wiredep').stream;
    gulp.src('./karma.conf.js')
        .pipe(wiredep({
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
        }))
        .pipe(gulp.dest('./'));
});

// inject Angular scripts into index.html
gulp.task('index', ['templates'], function () {
    var target = gulp.src('./app/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./app/scripts/**/*.js',
                            '!./app/scripts/**/*.spec.js',
                            '!./app/scripts/templates.js',
                            '!./app/scripts/app.js'], { read: false })
        .pipe(angularFilesort());
    return target.pipe(injector(sources, {
        ignorePath: 'app',
        addRootSlash: false
    }))
        .pipe(gulp.dest('./app'));
});

gulp.task('wiredep', ['wiredep:index', 'wiredep:karma', 'index']);
