var connect = require('connect');
var gulp = require('gulp');
var historyApiFallback = require('connect-history-api-fallback');
var livereload = require('connect-livereload');
var prism = require('connect-prism');
var refresh  = require('gulp-livereload');
var serveStatic = require('serve-static');

gulp.task('connect', function (next) {
    var lrport = 35729;
    var server = connect();

    // Prism proxies
    server.use(prism.middleware);

    // Add live reload
    server.use(livereload({ port: lrport }));

    // HTML5 pushState fallback
    server.use(historyApiFallback);

    // Routes
    server.use(serveStatic('./compiled'));

    // Start live reload
    refresh.listen();

    // Start webserver
    server.listen(9000, next);
});
