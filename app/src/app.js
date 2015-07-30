angular.module('encoreApp', ['ngResource', 'encore.ui', 'encore.svcs.encore',
        'encoreApp.tpls', 'HomeSvcs', 'encore.svcs.supportService'])
    .config(function ($locationProvider, $httpProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
        $httpProvider.interceptors.push('TokenInterceptor'); //Injects auth token id into api calls
        $httpProvider.interceptors.push('UnauthorizedInterceptor'); //Redirects user to login page on 401
    })
    .run(function ($rootScope, $http, $window, Auth, Environment) {
        $rootScope.$on('$routeChangeStart', function () {
            if (Environment.get().name !== 'local' && !Auth.isAuthenticated()) {
                $window.location = '/login?redirect=' + $window.location.pathname;
                return;
            }
        });

        // Forces JSON only
        $http.defaults.headers.common['Accept'] = 'application/json';
    })
    .factory('User', function ($resource) {

        var svc = $resource('/api/user/:id/:no/:param/:test', {
            'id': '@id'
        }, {
            update: {
                method: 'PUT'
            }
        });

        svc.prototype.getName = function () {
            return this.first + ' ' + this.last;
        };

        svc.prototype.toggleLazy = function () {
            this.lazy = !this.lazy;
            return this.lazy;
        };

        return svc;
    })
    .controller('demoCtrl', function (User) {
        var vm = this;

        // Scope vars go here
        var fetchUsers = function () {
            vm.users = User.query();
        };

        var createUser = function (user) {
            user = new User(user);
            user.$save().finally(vm.fetchUsers);
        };

        var toggleLazy = function (user) {
            user.toggleLazy();
            user.$save();
        };

        var getUserToEdit = function (id) {
            vm.editUser = User.get({ id: id });
            vm.editUser.$promise.then(console.log.bind(console, 'USER:'));
        };

        vm.fetchUsers = fetchUsers;
        vm.createUser = createUser;
        vm.toggleLazy = toggleLazy;
        vm.getUserToEdit = getUserToEdit;
        vm.formUser = {};
        vm.fetchUsers();
    });
