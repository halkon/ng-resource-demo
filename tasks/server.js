/* Usage: `$ grunt server` or `$ grunt server:dist` or `$ grunt server:stubbed:watch` */
module.exports = function (grunt) {
    grunt.registerTask('server',
        'Runs app in development mode. Options: "server", "server:dist", "server:stubbed:watch"',
        function(target, watch) {
            var commonTasks = [
                'clean',
                'jshint',
                'jscs',
                'karma:watch',
                'less',
                'connect:livereload',
                'configureProxies:live'
            ];

            if (target === 'dist') {
                return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
            } else if (target === 'stubbed') {
                commonTasks.unshift('stubby');
                commonTasks.pop();
                commonTasks.push('configureProxies:mocked');
                if (watch === 'watch' || watch === 'true') {
                    commonTasks.push('open');
                    commonTasks.push('watch');
                }
            } else {
                commonTasks.push('open');
                commonTasks.push('watch');
            }
            grunt.task.run(commonTasks);
        });
};
