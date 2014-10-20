angular.module('encoreApp')
    .controller('HomeCtrl', function ($scope, Salutation) {
        $scope.hello = Salutation.get({ name: 'Developer' });
    });
