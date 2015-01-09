var gulp = require('gulp');
var karma = require('karma').server;
var karmaConf = process.cwd() + '/karma.conf.js';
var path = require('path');
var runSequence = require('run-sequence').use(gulp);
var wiredep = require('wiredep').stream;

var bowerPath = global.config.bowerPath;
var compilePath = global.config.compilePath;
var srcPath = global.config.srcPath;

// Run test once and exit
gulp.task('karma:single', ['lint', 'compile'], function (done) {
    karma.start({
        singleRun: true,
        configFile: karmaConf
    }, done);
});//karma:single

// Watch files, running only the spec for the changed script or spec
gulp.task('karma:watch', ['lint', 'compile'], function () {
    gulp.watch(srcPath + '/src/**/*.js').on('change', function (event) {
        // Extract the filename without extension from the path.
        var filename = path.basename(path.basename(event.path, '.js'), '.spec');

        runSequence('lint', 'compile:scripts', function () {
            karma.start({
                singleRun: true,
                configFile: karmaConf,
                exclude: [compilePath + '/src/**/!(' + filename + ').spec.js']

            // The default value of the third argument is process.exit,
            // which would terminate the gulp task. Use a noop, instead.
            }, function () {});
        });
    });
});//karma:watch

// Run tests in debug mode
gulp.task('karma:debug', ['lint', 'compile'], function (done) {
    karma.start({
        singleRun: false,
        browsers: ['Chrome'],
        preprocessors: {},
        configFile: karmaConf
    }, done);
});//karma:debug

// Run Karma using the threshold reporter
gulp.task('karma:threshold', ['lint', 'compile'], function (done) {
    karma.start({
        singleRun: true,
        configFile: karmaConf,
        reporters: ['coverage', 'threshold']
    }, done);
});//karma:threshold

// Only run during builds -- fails on lint and unit test errors
gulp.task('karma:build', ['lint:strict', 'compile:build'], function (done) {
    karma.start({
        singleRun: true,
        configFile: karmaConf
    }, done);
});//karma:build

gulp.task('karma:wiredep', function () {
    var wiredepOptions = {
        directory: bowerPath,
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
