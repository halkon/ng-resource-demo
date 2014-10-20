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
            'app/bower_components/es5-shim/es5-shim.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-animate/angular-animate.js',
            'app/bower_components/json3/lib/json3.min.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-resource/angular-resource.js',
            'app/bower_components/angular-cookies/angular-cookies.js',
            'app/bower_components/angular-sanitize/angular-sanitize.js',
            'app/bower_components/lodash/dist/lodash.compat.js',
            'app/bower_components/mousetrap/mousetrap.js',
            'app/bower_components/mousetrap-bind-element/mousetrap-bind-element.js',
            'app/bower_components/html2canvas/build/html2canvas.js',
            'app/bower_components/momentjs/moment.js',
            'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/bower_components/angular-hotkeys/build/hotkeys.min.js',
            'app/bower_components/encore-ui/encore-ui-tpls.js',
            // endbower
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/src/app.js', // always load app definition first
            'app/templates.js',
            'app/src/**/*.js',
            'test/browser-helpers.js'
            // '../test/window-hack.js', // Only load when preventing window.location redirects
        ],

        // list of files to exclude
        exclude: [
        ],

        preprocessors: {
            'app/src/**/!(*.spec).js': ['coverage']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['mocha', 'coverage'],

        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
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
