var config = require('../util/config.js');

//TODO: Verify functionality
module.exports = {
    config: config,
    dist: {
        files: {
            '<%= uglify.config.appDest %>/scripts/scripts.js': [
                '<%= uglify.config.appDest %>/scripts/scripts.js'
            ]
        }
    }
};
