var config = require('../util/config.js');

module.exports = {
    options: {
        port: 9000,
        hostname: 'localhost'
    },
    proxies: [
        {
            context: '/api',
            host: 'localhost',
            port: 3000,
            https: false,
            changeOrigin: false,
            rewrite: {
                '/api': '/api'
            }
        },
        {
            context: '/identity',
            host: 'identity.api.rackspacecloud.com',
            port: 443,
            https: true,
            xforward: true,
            changeOrigin: true,
            rewrite: {
                'identity': '/v2.0'
            }
        }
    ],
    livereload: {
        options: {
            middleware: function(cnct) {
                return [
                    config.proxyRequest,
                    config.modRewrite(['!\\.\\w+$ /']),
                    config.liveReloadPage,
                    config.mountFolder(cnct, '.tmp'),
                    config.mountFolder(cnct, config.app)
                ];
            }
        }
    },
    test: {
        options: {
            middleware: function(cnct) {
                return [
                    config.proxyRequest,
                    config.modRewrite(['!\\.\\w+$ /']),
                    config.liveReloadPage,
                    config.mountFolder(cnct, '.tmp'),
                    config.mountFolder(cnct, config.app)
                ];
            }
        }
    },
    dist: {
        options: {
            middleware: function(cnct) {
                return [
                    config.mountFolder(cnct, config.dist)
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
