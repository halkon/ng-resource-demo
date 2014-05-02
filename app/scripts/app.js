'use strict';

angular.module('encoreApp', ['ngRoute', 'ngResource', 'encore.ui', 'encore.ui.rxModalAction', 'homeSvcs'])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'views/home/home.html',
                controller: 'HomeCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });

        $locationProvider.html5Mode(true).hashPrefix('!');
        $httpProvider.interceptors.push('TokenInterceptor'); //Injects auth token id into api calls
        $httpProvider.interceptors.push('UnauthorizedInterceptor'); //Redirects user to login page on 401
    }).run(function ($window, Auth, Environment) {
        var environment = Environment.get().name;

        if (environment !== 'local' && !Auth.isAuthenticated()) {
            $window.location = '/login?redirect=' + $window.location.pathname;
        }
    }).controller('LoginModalCtrl', function ($scope, Auth, Environment, rxNotify) {
        $scope.environment = Environment.get().name;

        var authenticate = function (credentials, success, error) {
            //override the body here
            var body = {
            };

            return Auth.loginWithJSON(body, success, error);
        };

        $scope.user = {};
        $scope.login = function () {
            return authenticate($scope.user, function (data) {
                Auth.storeToken(data);
            }, function (error) {
                rxNotify.add('Invalid Username or RSA Token', { type: 'warning' });
                $scope.user.token = '';
                console.log(error);
            });
        };
    });
