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
    }).run(function ($http, $window, Auth) {
        if (!Auth.isAuthenticated()) {
            $window.location = '/login?redirect=' + $window.location.pathname;
        }

        // Forces JSON only
        $http.defaults.headers.common['Accept'] = 'application/json';

    });
