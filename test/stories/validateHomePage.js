var homePage = require('../pages/home.page');
var loginPage = require('../pages/login.page');

describe('Home Page @dev', function () {

    before(function () {
        loginPage.login();
    });

    it('should have logged in', function () {
        expect(loginPage.isLoggedIn()).to.eventually.be.true;
    });

    it('should display a page heading', function () {
        expect(encore.rxPage.main.title).to.eventually.equal('Home Page');
    });

    it('should display a page subtitle', function () {
        expect(encore.rxPage.main.subtitle).to.eventually.equal('Subtitle Here');
    });

    it('should have a content heading', function () {
        expect(homePage.contentTitle).to.eventually.equal('Page Title');
    });

    after(function () {
        loginPage.logout();
    });

});
