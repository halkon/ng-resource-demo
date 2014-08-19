var Page = require('astrolabe').Page;
var _ = require('lodash');
var rest = require('restler');
var homePage = require('./home.page');

module.exports = Page.create({
    url: {
        get: function () {
            var redirect = this.driver.params.loginRedirect || 'cloud';
            return '/login/?redirect=' + redirect;
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
            page.go();
            return browser.driver.getCurrentUrl().then(function (url) {
                if (!(/login/.test(url))) {
                    return;
                } else if (/encore.rackspace.com/.test(url)) {
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
            this.loginWithToken(username, password);
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

    loginWithToken: {
        value: function (username, password) {
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
                    var addTokenToLocalStorage = function (token) {
                        localStorage.setItem('encoreSessionToken', token);
                    };

                    page.driver.executeScript(addTokenToLocalStorage, JSON.stringify(data));
                } else {
                    var msg = 'error authenticating as ' + username + '. Check password.';
                    page.InvalidAuthException.thro(msg);
                }
            });
            this.go();
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
    },

    isLoggedIn: {
        value: function () {
            this.go();
            return $('rx-app').isPresent();
        }
    },

    switchToUser: {
        value: function (userName) {
            this.driver.params.lastUser = this.driver.params.user;
            this.driver.params.user = userName;
        }
    },

    switchToLastUser: {
        value: function () {
            if (_.has(this.driver.params, 'lastUser')) {
                this.driver.params.user = this.driver.params.lastUser;
            }
        }
    },

});
