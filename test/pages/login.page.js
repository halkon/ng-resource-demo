var Page = require('astrolabe').Page;
var _ = require('lodash');
var rest = require('restler');

var homePage = require('./home.page');
var defaultRoles = require('../roles');

module.exports = Page.create({
    url: { get: function () { return '/login?redirect=' +  this.driver.params.loginRedirect; }},

    txtUsername: {
        get: function () { return $('#username'); }
    },

    txtPassword: {
        get: function () { return $('#token'); }
    },

    btnSubmit: {
        get: function () { return $('.button.primary'); }
    },

    cssInvalidLogin: {
        get: function () { return '.notification-text'; }
    },

    lblInvalidLogin: {
        get: function () { return $(this.cssInvalidLogin); }
    },

    invalidNotificationText: {
        get: function () {
            var page = this;
            return this.invalidNotificationIsDisplayed().then(function (isDisplayed) {
                return isDisplayed ? page.lblInvalidLogin.getText() : '';
            });
        }
    },

    invalidNotificationIsDisplayed: {
        value: function () {
            return $$(this.cssInvalidLogin).then(function (notifications) {
                return notifications.length > 0;
            });
        }
    },

    login: {
        // This function delegates the handling of auto-discovering usernames and passwords for you,
        // depending on where you're trying to log in, and who you're trying to log in as.
        //
        // This allows you to use the same `login()` function, without arguments, everywhere, and
        // still be authenticated as something.
        //
        // If you use this function without arguments on staging, it will grab the first available 
        // username and password from `test/secrets.js`, and it will log you in using those.
        //
        // If you use this function with only one argument on staging, it will assume that is the username,
        // look it up in `test/secrets.js` and use the password it finds there.
        //
        // If you use this function with any number of arguments on localhost, it will default any unsupplied
        // arguments with the default mock username/password pair.
        value: function (username, password) {
            var page = this;
            return this.driver.getCurrentUrl().then(function (url) {
                if (/encore.rackspace.com/.test(url)) {
                    page.loginStaging(username, password);
                } else {
                    page.loginLocalhost(username, password);
                }
            });
        }
    },

    loginStaging: {
        value: function (username, password) {
            var definedArgs = _.filter(arguments, function (arg) { return arg !== undefined; });
            switch (_.size(definedArgs)) {
                case 0:
                    username = _.first(_.keys(this.driver.params.logins));
                    password = this.driver.params.logins[username];
                    break;
                case 1:
                    password = this.driver.params.logins[username];
                    break;
                default:
                    break;
            }
            this.setLocalStorage(username, password);
            this.go();
        }
    },

    loginLocalhost: {
        value: function (username, password) {
            username = username === undefined ? 'racker' : username;
            password = password === undefined ? 'pass' : password;
            this.enterLoginCredentials(username, password);
        }
    },

    enterLoginCredentials: {
        value: function (username, password) {
            this.txtUsername.clear();
            this.txtUsername.sendKeys(username);
            this.txtPassword.clear();
            this.txtPassword.sendKeys(password);
            this.btnSubmit.click();
        }
    },

    setLocalStorage: {
        // Makes a request to identity, and will set the token inside of a default set of user
        // roles for reasonable staging tests. These will be written to local storage.
        //
        // The "roles" parameter, should you provide it, is a javascript object, which will be
        // set in local storage. If it is not provided, the username will be used to look up a 
        // set of default roles and those will be used instead.
        value: function (username, password, roles) {
            var page = this;
            if (roles === undefined) {
                roles = defaultRoles[username] || defaultRoles.racker;
            }

            roles.access.user.id = username;
            this.getIdentityToken(username, password, function (data) {
                roles.access.token.id = data.access.token.id;
                var jsonRoles = JSON.stringify(roles);
                /* jshint quotmark:true */
                var script = "localStorage.setItem('encoreSessionToken', '" + jsonRoles + "');";
                page.driver.executeScript(script);
            });
        }
    },

    getIdentityToken: {
        value: function (username, password, callback) {
            var page = this;
            var json = {
                auth: {
                    'RAX-AUTH:domain': {
                        name: 'Rackspace'
                    },
                    passwordCredentials: {
                        username: username,
                        password: password
                    }
                }
            };

            rest.post('https://staging.identity-internal.api.rackspacecloud.com/v2.0/tokens', {
                data: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).on('complete', function (data, response) {
                if (response.statusCode === 200) {
                    callback(data);
                } else {
                    var msg = 'error authenticating as ' + username + '. Check password.';
                    page.InvalidAuthException.thro(msg);
                }
            });
        }
    },

    logout: {
        value: function () {
            // TODO: Replace this with rxLogout's logout() function.
            // homepage.navigation.logout();
            homePage.navigation.lnkLogout.click();
        }
    },

    InvalidAuthException: {
        get: function () { return this.exception('Invalid staging identity credentials'); }
    }

});
