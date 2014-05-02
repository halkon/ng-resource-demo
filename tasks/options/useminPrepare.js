var config = require('../util/config.js'),
    _ = require('lodash'),
    fixPath = function (path) {
        // If the src path matches app/{{config.appName}} replace it with just app.
        // this should allow concat to find the src file, while keeping the
        // paths in the html with the absolute path to the name of the app
        return path.indexOf('app/' + config.appName) !== -1 ? path.replace('app/' + config.appName, 'app') : path;
    };

module.exports = {
    html: 'app/index.html',
    options: {
        dest: 'dist',
        flow: {
            steps: {
                // Run concat only for js
                js: ['concat'],
                // Run concat & css min for css
                css: ['concat', 'cssmin']
            },
            post: {
                js: [{
                    name: 'concat',
                    // Post Process the generated configuration to fix paths
                    createConfig: function (context, block) {
                        // Map each of the files to be generated and modify their src filepaths
                        _.map(context.options.generated.files, function (file) {
                            // Pass each src file to the fixPath to get the proper src path
                            file.src = _.map(file.src, fixPath);
                            return file;
                        });
                    }
                }]
            }
        }
    }
};