module.exports = {
    options: {
        'dest': 'dist/ngdocs',
        'title': 'Encore Developer Documentation',
        'html5Mode': false
    },
    guides: {
        src: ['guides/**/*.ngdoc'],
        title: 'Encore Developer Guides'
    },
    all: ['app/scripts/**/*.js']
};
