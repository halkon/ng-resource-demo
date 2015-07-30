// This file is use primarily with the connect.js gulp configuration
var prism = require('connect-prism');
var baseHref = global.config.baseHref.substring(1); // remove leading '/'

module.exports = function prismInit (prismMode) {
    prismMode = prismMode || 'proxy';

    var appLocalRewrite = {};
    appLocalRewrite[baseHref] = '';

    prism.create({
        name: 'login',
        context: '/login',
        host: 'staging.encore.rackspace.com',
        port: 443,
        https: true,
        changeOrigin: false,
        rewrite: {
            // Routes all login dependencies
            'login/*': '/login/',
            // Route login to index to avoid redirects
            'login/?$': '/login/index.html'
        }
    });

    prism.create({
        name: 'app',
        context: '/' + baseHref,
        host: 'localhost',
        port: 9000,
        rewrite: appLocalRewrite
    });

    if (prismMode === 'stubbed') {
        prism.create({ // Default catch all for all stubbed out API's
            name: 'default',
            context: '/api',
            host: 'localhost',
            port: 3000,
            https: false,
            changeOrigin: false
        });
    } else {
        prism.create({
            name: 'identity',
            context: '/api/identity',
            // Point to the identity host relevant to the project
            host: 'staging.identity-internal.api.rackspacecloud.com',
            port: 443,
            https: true,
            changeOrigin: true,
            rewrite: {
                'api/identity': '/v2.0'
            }
        });

        prism.create({
            name: 'cas',
            mode: prismMode,
            context: '/api/customer-admin',
            host: 'customer-admin.staging.ord1.us.ci.rackspace.net',
            port: 443,
            https: true,
            changeOrigin: true,
            rewrite: {
                'api/customer-admin': '/v3'
            }
        });

        prism.create({
            name: 'support',
            mode: prismMode,
            context: '/api/support',
            host: 'staging.dfw.support.encore.rackspace.com',
            port: 443,
            https: true,
            changeOrigin: true,
            rewrite: {
                'api/support': '/api'
            }
        });

        prism.create({
            name: 'user',
            mode: prismMode,
            context: '/api/user',
            host: 'localhost',
            port: 2403,
            https: false,
            changeOrigin: true,
            rewrite: {
                'api/user': '/user'
            }
        });
    }
};
