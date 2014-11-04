var gulp = require('gulp');
var refresh  = require('gulp-livereload');

var srcPath = global.config.srcPath;

gulp.task('watch', function () {
    var scriptSources = [ srcPath + '/src/**/*.js' ];
    var styleSources = [ srcPath + '/src/**/*.less' ];
    var templateSources = [ srcPath + '/src/**/*.html' ];
    var indexFile = srcPath + '/index.html';

    gulp.watch(indexFile, ['compile:index']);
    gulp.watch(styleSources, ['compile:styles']);
    gulp.watch(templateSources, ['compile:templates']);
    gulp.watch([scriptSources, indexFile], ['karma:single']);

    gulp.watch([srcPath + '/src/**/*']).on('change', refresh.changed);
    gulp.watch('bower.json', ['karma:wiredep', 'compile:index']);
});//watch
