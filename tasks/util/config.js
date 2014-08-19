var appName = 'template', appLocalRewrite = {};
appLocalRewrite['/' + appName] = '';

module.exports = {
    app: 'app',
    dist : 'dist',
    ngdocs: 'ngdocs',
    appName: appName,
    appDest: 'dist/' + appName,
    open: {
        hostname: 'localhost',
        port: 9000
    },
    liveReloadPage: require('connect-livereload')({ port: 35729 }),
    proxyRequest: require('grunt-connect-proxy/lib/utils').proxyRequest,
    modRewrite: require('connect-modrewrite'),
    mountFolder : function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    },
    mockedProxies: [
        {
            context: '/api/identity',
            // Point to the identity host relevant to the project
            host: 'localhost',
            port: 3000,
            https: false,
            xforward: true,
            changeOrigin: true
        },
    ],
    defaultProxies: [
        {
            context: '/login',
            host: 'staging.encore.rackspace.com',
            port: 443,
            https: true,
            protocol: 'https',
            changeOrigin: false,
            rewrite: {
                // Routes all login dependencies
                '^/login/*': '/login/',
                // Route login to index to avoid redirects
                '^/login/?$': '/login/index.html'
            }
        },
        {
            context: '/' + appName,
            host: 'localhost',
            port: 9000,
            rewrite: appLocalRewrite
        },
        {
            context: '/api/identity',
            // Point to the identity host relevant to the project
            host: 'staging.identity-internal.api.rackspacecloud.com',
            port: 443,
            https: true,
            xforward: true,
            changeOrigin: true,
            rewrite: {
                '/api/identity': '/v2.0'
            }
        },
        {
            context: '/api/customer-admin',
            host: 'customer-admin.staging.ord1.us.ci.rackspace.net',
            port: 443,
            https: true,
            changeOrigin: true,
            rewrite: {
                '/api/customer-admin': '/v3'
            }
        },
        {
            context: '/api/support',
            host: 'staging.dfw.support.encore.rackspace.com',
            port: 443,
            https: true,
            changeOrigin: true,
            rewrite: {
                '/api/support': '/api'
            }
        },
        {
            context: '/api/encore',
            host: 'staging.encore.rackspace.com',
            https: true,
            port: 443,
            xforward: true,
            changeOrigin: true,
            rewrite: {
                '/api': '/api'
            }
        },
        { // Default catch all for all stubbed out API's
            context: '/api',
            host: 'localhost',
            port: 3000,
            https: false,
            changeOrigin: false
        }
    ]
};
