var homePage = require('../pages/home.page');
var loginPage = require('../pages/login.page');

var _ = require('lodash');
var expect = require('../setupExpect');

describe('Login Page', function () {

    before(function () {
        loginPage.go();
    });

    it('should not log you in with a blank username and password #smoke', function () {
        loginPage.login('', '');
        expect(loginPage.currentUrl).to.eventually.contain('login');
    });

    it('should not log you in with a blank username #smoke', function () {
        loginPage.login('', 'pass');
        expect(loginPage.currentUrl).to.eventually.contain('login');
    });

    it('should not log you in with a blank password #smoke', function () {
        loginPage.login('user', '');
        expect(loginPage.currentUrl).to.eventually.contain('login');
    });

    it('should not log you in with invalid credentials #smoke', function () {
        loginPage.login('INVALID', 'INVALID');
        expect(loginPage.invalidNotificationText).to.eventually.contain('Invalid Username or RSA Token');
    });

    describe('successfully logging in', function () {
        var roles = ['racker', 'admin', 'architect', 'systemuser'];

        _.forEach(roles, function (role) {
            it('should log you in as the ' + role + ' role #smoke @dev', function () {
                loginPage.login(role, 'pass');
                expect(homePage.currentUrl).to.eventually.contain(homePage.driver.params.loginRedirect);
            });
        });

        afterEach(function () {
            loginPage.logout();
            loginPage.go();
        });

    });

});
