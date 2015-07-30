var deployd = require('deployd');

var gulp = require('gulp');

gulp.task('dpd', function (next) {
    var dpd = deployd({
        port: 2403
    });

    console.log(dpd);

    dpd.listen();
    dpd.on('listening', next);
});
