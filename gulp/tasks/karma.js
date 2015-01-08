var gulp = require('gulp');
var _ = require('lodash');
var karma = require('karma').server;
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence').use(gulp);
var path = require('path');
var karmaConf = process.cwd() + '/karma.conf.js';

// Run test once and exit
gulp.task('karma:single', ['lint', 'compile'], function (done) {
    karma.start(_.assign({}, { singleRun: true, configFile: karmaConf }), done);
});

// Watch files, running only the spec for the changed script or spec
gulp.task('karma:watch', ['lint', 'compile'], function () {
    gulp.watch(global.config.srcPath + '/src/**/*.js').on('change', function (event) {
        // Extract the filename without extension from the path.
        var filename = path.basename(path.basename(event.path, '.js'), '.spec');

        runSequence('lint', 'compile:scripts', function () {
            karma.start({
                singleRun: true,
                configFile: karmaConf,
                exclude: [global.config.compilePath + '/src/**/!(' + filename + ').spec.js']

            // The default value of the third argument is process.exit,
            // which would terminate the gulp task.
            }, _.noop);
        });
    });
});

// Run tests in debug mode
gulp.task('karma:debug', function (done) {
    karma.start(_.assign({}, {
        singleRun: false,
        browsers: ['Chrome'],
        preprocessors: {},
        configFile: karmaConf
    }), done);
});

// Run Karma using the threshold reporter
gulp.task('karma:threshold', ['lint'], function (done) {
    karma.start(_.assign(
        { reporters: ['coverage', 'threshold'] },
        { singleRun: true, configFile: karmaConf }), done);
});

// Only run during builds -- fails on lint and unit test errors
gulp.task('karma:build', ['lint:strict', 'compile'], function (done) {
    karma.start(_.assign({}, { singleRun: true, configFile: karmaConf }), done);
});

gulp.task('karma:wiredep', function () {
    var wiredepOptions = {
        directory: global.config.bowerPath,
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

    return gulp.src(karmaConf)
        .pipe(wiredep(wiredepOptions))
        .pipe(gulp.dest('.'));
});//karma:wiredep
