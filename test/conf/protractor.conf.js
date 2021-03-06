/*jshint node:true */
// For some reason 'grunt jshint' doesn't respect the node:true in the .jshintrc file, so we have to add it here

var config = require('../../config.json');

exports.config = {
    framework: 'mocha',

    // The address of a running selenium server. If this is specified,
    // seleniumServerJar and seleniumPort will be ignored.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:9000',
    rootElement: '[ng-app]',

    specs: [
        '../stories/*.js'
    ],

    params: {
        loginRedirect: config.appName + '/home'
    },

    onPrepare: function () {
        expect = require('chai').use(require('chai-as-promised')).expect;
        encore = require('rx-page-objects');
    },

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'firefox'
    },

    mochaOpts: {
        enableTimeouts: false,
        reporter: 'spec',
        slow: 3000,
        ui: 'bdd',
        // exclude anything marked as #regression or @staging
        grep: /^(?!.*(#regression|@staging).*).*$/
    }
};
