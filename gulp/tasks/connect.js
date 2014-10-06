var gulp = require('gulp');
var livereload = require('connect-livereload');
var refresh  = require('gulp-livereload');
var connect = require('connect');
var serveStatic = require('serve-static');
var historyApiFallback = require('connect-history-api-fallback');
var prism = require('connect-prism');
var prismInit = require('./prism');

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
server.use(serveStatic('./app'));

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

// Watch for changes
var watch = function () {
    gulp.watch(['./app/scripts/**/*.js', './app/index.html'], ['karma:single']);
    gulp.watch(['./app/styles/**/*.less'], ['styles']);
    gulp.watch(['./app/views/**/*.html'], ['templates']);
    gulp.watch('./app/**/*').on('change', refresh.changed);
    gulp.watch('bower.json', ['wiredep']);
};

gulp.task('server', ['open'], function () {
    prismInit();
    watch();
});

gulp.task('server:mock', ['open'], function () {
    prismInit('mock');
    watch();
});

gulp.task('server:record', ['open'], function () {
    prismInit('record');
    watch();
});
