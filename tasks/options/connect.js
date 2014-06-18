var config = require('../util/config.js');

module.exports = {
    options: {
        port: 9000,
        hostname: 'localhost'
    },

    live: {
        proxies: [].concat(config.defaultProxies),
    },

    mocked: {
        proxies: [].concat(config.mockedProxies).concat(config.defaultProxies),
    },

    livereload: {
        options: {
            middleware: function (cnct) {
                return [
                    config.proxyRequest,
                    config.modRewrite(['!\\.[0-9a-zA-Z_-]+$ /index.html']),
                    config.liveReloadPage,
                    config.mountFolder(cnct, '.tmp'),
                    config.mountFolder(cnct, config.app)
                ];
            }
        }
    },

    test: {
        options: {
            middleware: function (cnct) {
                return [
                    config.proxyRequest,
                    config.modRewrite(['!\\.[0-9a-zA-Z_-]+$ /index.html']),
                    config.liveReloadPage,
                    config.mountFolder(cnct, '.tmp'),
                    config.mountFolder(cnct, config.app)
                ];
            }
        }
    },

    dist: {
        options: {
            middleware: function (cnct) {
                return [
                    config.proxyRequest,
                    config.modRewrite(['!\\.[0-9a-zA-Z_-]+$ /index.html']),
                    config.mountFolder(cnct, config.appDest)
                ];
            }
        }
    },

    docs: {
        options: {
            middleware: function (cnct) {
                return [
                    config.mountFolder(cnct, config.ngdocs)
                ];
            }
        }
    }
};
