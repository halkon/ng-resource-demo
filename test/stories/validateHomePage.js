var homePage = require('../pages/home.page');
var loginPage = require('../pages/login.page');

var expect = require('../setupExpect');

describe('Home Page', function () {

    before(function () {
        loginPage.go();
        loginPage.login();
    });

    it('should display a page heading #smoke @dev', function () {
        expect(homePage.title).to.eventually.equal('Home Page');
    });

    it('should display a page subtitle #smoke @dev', function () {
        expect(homePage.subtitle).to.eventually.equal('Subtitle Here');
    });

    after(function () {
        loginPage.logout();
    });

});
