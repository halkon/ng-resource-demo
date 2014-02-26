var homePage = require('../pages/HomePage'),
    expect = require('../setupExpect').expect;

describe('LoginPage: Validate page content', function () {
    before(function () {
        homePage.go();
    });

    it('Should display heading with correct content', function () {
        expect(homePage.heading).to.eventually.exist;
        expect(homePage.heading.getText()).to.eventually.eq('Hello, I am a home page');
    });

    it('Should be display scope variable', function () {
        expect(homePage.hello.getText()).to.eventually.eq('Hello, I am a home page');
    });
});