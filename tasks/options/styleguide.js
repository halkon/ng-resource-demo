var config = require('../util/config.js');

module.exports = {
    config: config,
    options: {
        _: ['<%= styleguide.config.app %>/styles'],
        name: 'Encore',
        out: '<%= styleguide.config.dist %>/styleguide',
        in : ['<%= styleguide.config.app %>/styles'],
        include: [undefined],
        basePath: '<%= styleguide.config.app %>/styles'
    }
};