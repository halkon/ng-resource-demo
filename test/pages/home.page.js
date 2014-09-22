var Page = require('astrolabe').Page;

var rxApp = require('rx-page-objects').rxApp;

module.exports = Page.create({
    url: { value: '/home' },

    navigation: {
        get: function () { return rxApp.initialize($('.rx-app')); }
    },

    contentTitle: {
        get: function () {
            return $('.content h1').getText();
        }
    }

});
