var Page = require('astrolabe').Page;

var rxApp = require('rx-page-objects').rxApp;

module.exports = Page.create({
    url: { value: '/home' },

    eleRxApp: {
        get: function () { return $('.rx-app'); }
    },

    lblTitle: {
        get: function () {
            return $('.page-title');
        }
    },

    lblSubtitle: {
        get: function () {
            return $('.page-subtitle');
        }
    },

    navigation: {
        get: function () { return rxApp.initialize(this.eleRxApp); }
    },

    subtitle: {
        get: function () { return this.lblSubtitle.getText(); }
    },

    title: {
        get: function () { return this.lblTitle.getText(); }
    }

});
