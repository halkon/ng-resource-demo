var config = require('../util/config.js');

module.exports = {
    config: config,
    dist: {
        files: {
            src: [
                '<%= rev.config.appDest %>/scripts/{,*/}*.js',
                '<%= rev.config.appDest %>/styles/{,*/}*.css',
                '<%= rev.config.appDest %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                '<%= rev.config.appDest %>/styles/fonts/*'
            ]
        }
    }
};
