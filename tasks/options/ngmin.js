var config = require('../util/config.js');

module.exports = {
    config: config,
    dist: {
        files: [{
            expand: true,
            cwd: '<%= ngmin.config.appDest %>/scripts',
            src: ['*.js','!*.spec.js'],
            dest: '<%= ngmin.config.appDest %>/scripts'
        }]
    }
};
