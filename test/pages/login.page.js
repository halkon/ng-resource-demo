var Page = require('astrolabe').Page;
var _ = require('lodash');
var rest = require('restler');

var defaultRoles = require('../roles');

module.exports = Page.create({
    url: {
        get: function () {
            return '/login?redirect=' +  browser.params.loginRedirect;
        }
    },

    txtUsername: {
        get: function () { return $('#username'); }
    },

    txtPassword: {
        get: function () { return $('#token'); }
    },

    btnSubmit: {
        get: function () { return $('.rx-button'); }
    },

    btnLogout: {
        get: function () {
            return $('[rx-logout]');
        }
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
                if (isDisplayed) {
                    return page.lblInvalidLogin.getText();
                } else {
                    return protractor.promise.fulfilled('');
                }
            });
        }
    },

    invalidNotificationIsDisplayed: {
        value: function () {
            return $(this.cssInvalidLogin).isPresent();
        }
    },

    isLoggedIn: {
        value: function () {
            return this.btnLogout.isPresent();
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
            this.go();
            return browser.getCurrentUrl().then(function (url) {
                if (!/login/.test(url)) {
                    // Already logged in. Do nothing.
                    return;
                }

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
                case 0: {
                    username = _.first(_.keys(browser.params.logins));
                    password = browser.params.logins[username];
                    break;
                }
                case 1: {
                    password = browser.params.logins[username];
                    break;
                }
                default: {
                    break;
                }
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
                var addTokenToLocalStorage = function (token) {
                    localStorage.setItem('encoreSessionToken', token);
                };
                page.driver.executeScript(addTokenToLocalStorage, JSON.stringify(roles));
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
            this.btnLogout.click();
        }
    },

    InvalidAuthException: {
        get: function () { return this.exception('Invalid staging identity credentials'); }
    }

});
