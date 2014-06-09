module.exports = {
    options: {
        config: '.jscs.json',
        requireCurlyBraces: [ 'if' ]
    },

    scripts: {
        files: {
            src: [ 'app/scripts/**/*.js','!app/scripts/**/*.spec.js', '!app/scripts/debug.js']
    
        }
    },

    specs: {
        files: {
            src: [ 'app/scripts/**/*.spec.js' ]
        }
    },

    tests: {
        files: {
            src: [ 'test/pages/**/*.js',
                   'test/stories/**/*.js' ]
        }
    }
};
