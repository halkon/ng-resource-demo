module.exports = {
    development: {
        options: {
            // Specifies directories to scan for @import directives when parsing.
            // Default value is the directory of the source, which is probably what you want.
            paths: ['{.tmp, app/styles/'],
            sourceMap: true,
            sourceMapURL: '/styles/app.css.map',
            sourceMapFilename: 'app/styles/app.css.map',
            outputSourceFiles: 'true'
        },
        files: {
            // compilation.css  :  source.less
            'app/styles/app.css': 'app/styles/app.less'
        }
    }
};