angular.module('homeSvcs', [])
    .factory('Salutation', function () {
        return {
            get: function (obj) {
                return 'Hello ' + obj.name;
            }
        };
    });