/* jshint node:true */

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['mocha', 'chai', 'sinon-chai'],


        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'compiled/bower_components/angular/angular.js',
            'compiled/bower_components/angular-animate/angular-animate.js',
            'compiled/bower_components/angular-sanitize/angular-sanitize.js',
            'compiled/bower_components/angular-resource/angular-resource.js',
            'compiled/bower_components/angular-route/angular-route.js',
            'compiled/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'compiled/bower_components/lodash/dist/lodash.compat.js',
            'compiled/bower_components/momentjs/moment.js',
            'compiled/bower_components/html2canvas/build/html2canvas.js',
            'compiled/bower_components/mousetrap/mousetrap.js',
            'compiled/bower_components/angular-hotkeys/build/hotkeys.min.js',
            'compiled/bower_components/encore-ui/encore-ui-tpls.js',
            'compiled/bower_components/url/url.js',
            'compiled/bower_components/encore-ui-svcs/dist/encore-ui-svcs.js',
            // endbower
            'compiled/bower_components/angular-mocks/angular-mocks.js',
            'compiled/src/app.js', // always load app definition first
            'compiled/templates.js',
            'compiled/src/**/*.js',
            'test/browser-helpers.js'
            // '../test/window-hack.js', // Only load when preventing window.location redirects
        ],

        // list of files to exclude
        exclude: [
        ],

        preprocessors: {
            'compiled/src/**/!(*.spec).js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['mocha', 'coverage', 'threshold'],

        coverageReporter: {
            type : 'html',
            dir : 'dist/coverage/'
        },

        thresholdReporter: {
            statements: 90,
            branches: 60,
            functions: 85,
            lines: 90
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values:
        //  config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
