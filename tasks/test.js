module.exports = function (grunt) {
    grunt.registerTask('test', 'Runs unit tests - grunt unit:dev will run continously',
        function(type) {

        // define types of tests to run
        var types = {
            'unit': 'karma:single',
            'dev': 'karma:dev'
        };

        // set default to run unit and func test a single time
        var tasks = [types.unit].concat(types.mid);

        // check if param passed in (e.g. 'grunt test:unit')
        if (typeof type === 'string') {
            // overwrite default tasks with single task
            tasks = types[type];
        }

        grunt.task.run(tasks);
    });
};
