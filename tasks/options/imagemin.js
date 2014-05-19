var config = require('../util/config.js');

module.exports = {
    options: {
        config: config
    },
    dist: {
        files: [{
            expand: true,
            cwd: '<%= imagemin.options.config.app %>/images',
            src: '**/*.{png,jpg,jpeg}',
            dest: '<%= imagemin.options.config.appDest %>/images'
        }, {
            expand: true,
            cwd: '<%= imagemin.options.config.app %>/bower_components/encore-ui',
            src: '**/*.{png,jpg,jpeg}',
            dest: '<%= imagemin.options.config.appDest %>/styles'
        }]
    }
};