var deployd = require('deployd');

var gulp = require('gulp');

var defaultConfig = {
    port: 2403
};

if (process.env.MONGO_URI) {
    defaultConfig.db = {
        connectionString: process.env.MONGO_URI
    };
}

gulp.task('dpd', function (next) {
    var dpd = deployd(defaultConfig);

    console.log(dpd);

    dpd.listen();
    dpd.on('listening', next);
});
