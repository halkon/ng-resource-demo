/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any file in that folder gets automatically
  required by the loop in ./gulp/index.js (required below).

  To add a new task, simply add a new task file to gulp/tasks.
*/

var pkg = require('./package.json');
global.appName = pkg.config.appName;
global.gulpUtil = require('./gulp/util');
require('./gulp');
