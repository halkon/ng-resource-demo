var config = require('../util/config.js');

module.exports = {
    options: {
    	config: config
    },
    dist: {
        files: [{
            expand: true,
            cwd: '<%= svgmin.options.config.app %>/images',
            src: '{,*/}*.svg',
            dest: '<%= svgmin.options.config.dist %>/images'
        }]
    }
};
