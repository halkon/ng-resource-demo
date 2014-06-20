var config = require('../util/config.js');
module.exports = {
    html: ['<%= usemin.options.config.appDest %>/{,**/}*.html'],
    css: ['<%= usemin.options.config.appDest %>/styles/{,**/}*.css'],
    options: {
        config: config,
        dirs: ['<%= usemin.options.config.appDest %>'],
        assetsDirs: ['dist', '<%= usemin.options.config.appDest %>']
    }
};
