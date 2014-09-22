var _ = require('lodash');

var loginPage = require('../pages/login.page');

describe('Login Page', function () {

    before(function () {
        loginPage.go();
    });

    it('should not log you in with a blank username and password', function () {
        loginPage.enterLoginCredentials('', '');
        expect(loginPage.currentUrl).to.eventually.contain('login');
    });

    it('should not log you in with a blank username', function () {
        loginPage.enterLoginCredentials('', 'pass');
        expect(loginPage.currentUrl).to.eventually.contain('login');
    });

    it('should not log you in with a blank password', function () {
        loginPage.enterLoginCredentials('user', '');
        expect(loginPage.currentUrl).to.eventually.contain('login');
    });

    it('should not log you in with invalid credentials', function () {
        loginPage.enterLoginCredentials('INVALID', 'INVALID');
        expect(loginPage.invalidNotificationText).to.eventually.contain('Invalid Username or RSA Token');
    });

    describe('successfully logging in', function () {
        var roles = ['racker', 'admin', 'architect', 'systemuser'];

        _.forEach(roles, function (role) {
            it('should log you in as the ' + role + ' role @dev', function () {
                loginPage.login(role, 'pass');
                expect(browser.getCurrentUrl()).to.eventually.contain(browser.params.loginRedirect);
            });
        });

        // FIXME: Once you've changed your team's appName in tasks/util/config,
        // FIXME: and your protractor conf's loginRedirect parameter, unskip these.
        _.forEach(loginPage.driver.params.logins, function (stagingPassword, stagingLogin) {
            it.skip('should log you in as ' + stagingLogin.slice(0, 4) + '***** @staging', function () {
                loginPage.login(stagingLogin, stagingPassword);
                expect(loginPage.isLoggedIn()).to.eventually.be.true;
            });
        });

        afterEach(function () {
            loginPage.logout();
            loginPage.go();
        });

    });

});
