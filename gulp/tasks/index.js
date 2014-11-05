var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('index', ['index:inject']);

gulp.task('index:inject', function (cb) {
    runSequence('wiredep:index', 'scripts:inject', cb);
});//index:inject
