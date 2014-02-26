'use strict';

angular.module('encoreApp', ['ngRoute', 'ngResource'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'views/home/home.html',
                controller: 'HomeCtrl'
            })
            .otherwise({
                redirectTo: '/home'
            });

        $locationProvider.html5Mode(true).hashPrefix('!');
    });
