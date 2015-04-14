var through = require('through2');
var rimraf = require('rimraf');

module.exports = function () {
    return through.obj(function (vinylFile, enc, cb) {
        rimraf(vinylFile.path, cb);
    });
};
