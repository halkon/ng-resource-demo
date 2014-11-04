var connect = require('connect');
var gulp = require('gulp');
var historyApiFallback = require('connect-history-api-fallback');
var livereload = require('connect-livereload');
var prism = require('connect-prism');
var refresh  = require('gulp-livereload');
var serveStatic = require('serve-static');

// Run Connect server
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

gulp.task('connect', function () {
    // Start webserver
    require('http').createServer(server)
        .listen(9000)
        .on('listening', function () {
            console.log('Started connect web server on http://localhost:9000');
        });
    // Start live reload
    refresh.listen();
});
