var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var compilePath = global.config.compilePath;
var srcPath = global.config.srcPath;

gulp.task('watch', function () {
    gulp.watch(srcPath + '/index.html', ['compile:index']);
    gulp.watch(srcPath + '/src/**/*.less', ['compile:styles']);
    gulp.watch(srcPath + '/src/**/*.html', ['compile:templates']);
    gulp.watch(srcPath + '/src/**/*.js', ['karma:single']);

    gulp.watch([
        compilePath + '/src/**/*',
        compilePath + '/templates.js'
    ]).on('change', plugins.livereload.changed);
    gulp.watch('bower.json', ['karma:wiredep', 'compile:index']);
});//watch
