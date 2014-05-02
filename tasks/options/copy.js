var config = require('../util/config.js');

// Put files not handled in other tasks here
module.exports = {
    config: config,
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= copy.config.app %>',
            dest: '<%= copy.config.appDest %>',
            src: [
                '*.{ico,png,txt}',
                '.htaccess',
                'images/{,**/}*.{gif,webp}',
                'fonts/*',
                'views/**/*',
                '*.html',
                'widgets/**/*',
                'modules/**/*',
                '!scripts/**/*.spec.js'
            ]
        }, {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= copy.config.appDest %>/images',
            src: [
                'generated/*'
            ]
        }]
    },
    app: {
        expand:true,
        cwd: '<%= copy.config.app %>',
        src: ['**', '!**/*.spec.js', '!**/*.less'],
        dest: '<%= copy.config.appDest %>/'
    },
    plato: {
        files:[{
            expand: true,
            dot: true,
            dest: '<%= copy.config.appDest %>',
            src: [
                'report/**/*'
            ]
        }]
    }
};
