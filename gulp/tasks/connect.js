var fs = require('fs');
var path = require('path');

var connect = require('connect');
var gulp = require('gulp');
var historyApiFallback = require('connect-history-api-fallback');
var livereload = require('connect-livereload');
var prism = require('connect-prism');
var refresh  = require('gulp-livereload');
var serveStatic = require('serve-static');
var manifestData = {};

var _getStaticFile = function (filename) {
    if (!manifestData[filename]) {
        manifestData[filename] = fs.readFileSync(filename);
    }
    return manifestData[filename];
};

var _connect = function (staticPath, cb, skipDevMiddleware) {
    var lrport = 35729;
    var server = connect();
    skipDevMiddleware = skipDevMiddleware === true;

    if (skipDevMiddleware === false) {
        server.use('/newrelic', function (req, res) {
            res.setHeader('Content-Type', 'text/javascript');
            res.statusCode = 200;
            res.end(_getStaticFile(path.join(__dirname, '../util/newrelic.js')));
            return false;
        });

        // Prism proxies
        server.use(prism.middleware);

        // Add live reload
        server.use(livereload({ port: lrport }));

        // Start live reload
        refresh.listen();
    }

    // Adding healthz endpoint
    server.use('/healthz', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(_getStaticFile(path.join(global.config.buildPath, 'manifest.json')));
        return false;
    });

    // We need to serve static files up front
    // The reason to do this is so that they don't get
    // rewritten by the history-api-fallback middleware
    server.use(serveStatic(staticPath));

    // HTML5 pushState fallback
    // by disabling the dotRule, we allow for URLs that
    // contain periods to be rewritten back to index.html
    server.use(historyApiFallback);

    // in the case that we get here, it means that the
    // history API fallback has rewritten our request to
    // respond with index.html, so we need to serve up
    // static files again.  This is likely something
    // that needs to be improved
    server.use(serveStatic(staticPath));

    // Start webserver
    server.listen(9000, cb);
};

gulp.task('connect', ['connect:compile']);

gulp.task('connect:compile', function (next) {
    _connect('./compiled', next);
});

gulp.task('connect:build', function (next) {
    _connect('./dist/app', next);
});

gulp.task('connect:prod', function (next) {
    _connect('./dist/app', next, true);
});
