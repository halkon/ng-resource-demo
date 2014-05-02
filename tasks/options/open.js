var config = require('../util/config');

module.exports =  {
    server: {
        config: config,
        app: 'Google Chrome',
        url: 'http://' + config.open.hostname + ':' + config.open.port + '/' + config.appName
    }
};
