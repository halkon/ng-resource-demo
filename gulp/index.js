var fs = require('fs');
var tasks = fs.readdirSync('./gulp/tasks/').filter(global.gulpUtil.onlyScripts);

tasks.forEach(function (task) {
  require('./tasks/' + task);
});
