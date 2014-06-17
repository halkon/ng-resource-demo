/*jshint node:true */
// For some reason 'grunt jshint' doesn't respect the node:true in the .jshintrc file, so we have to add it here

var config = require('../tasks/util/config');
var secrets = require('./secrets');

exports.config = {
    framework: 'mocha',

    // The address of a running selenium server. If this is specified,
    // seleniumServerJar and seleniumPort will be ignored.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'https://staging.encore.rackspace.com',

    specs: [
        './stories/*.js'
    ],

    params: {
        logins: secrets.credentials,
        loginRedirect: config.appName + '/home'
    },


    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'firefox'
    },

    allScriptsTimeout: (1000 * 60 * 3),

    mochaOpts: {
        reporter: 'spec',
        slow: 5000,
        ui: 'bdd',
        // exclude anything marked as #regression or @dev
        grep: /^(?!.*(#regression|@dev).*).*$/
    }
};
