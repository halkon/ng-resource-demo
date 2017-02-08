angular.module('encoreApp', ['ngResource', 'encore.ui', 'encore.svcs.encore',
        'encore.svcs.supportService'])
    .config(function ($locationProvider, $httpProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
        $httpProvider.interceptors.push('TokenInterceptor'); //Injects auth token id into api calls
        $httpProvider.interceptors.push('UnauthorizedInterceptor'); //Redirects user to login page on 401
    })
    .run(function ($rootScope, $http, $window, Auth, Environment) {
        $rootScope.$on('$routeChangeStart', function () {
            if (!Environment.isLocal() && !Auth.isAuthenticated()) {
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
        vm.users = [];

        // Scope vars go here
        var resetFormUser = function () {
            vm.formUser = {};
        };

        var resetEditUser = function () {
            vm.editUser = {};
        };

        var fetchUsers = function () {
            vm.users.$promise = User.query().$promise;
            vm.users.$promise.then(function (users) {
                vm.users = users;
            });
            if (arguments.length > 0) {
                // Grab all function argumnets and pass them as .then
                _(arguments).compact().filter(_.isFunction).forEach(function (fn) {
                    vm.users.$promise.then(fn);
                });
            }
        };

        var getUser = function (user) {
            if (user instanceof User) {
                vm.editUser = user;
            } else if (_.isString(user)) {
                vm.editUser = User.get({ id: user });
            }
        };

        var saveUser = function (user) {
            user = new User(user);
            return user.$save()
                .then(resetEditUser)
                .then(resetFormUser)
                .finally(vm.fetchUsers);
        };

        var toggleLazy = function (user) {
            user.toggleLazy();
            user.$save();
        };

        vm.fetchUsers = fetchUsers;
        vm.saveUser = saveUser;
        vm.toggleLazy = toggleLazy;
        vm.getUser = getUser;

        // Init things
        vm.fetchUsers(resetFormUser, resetEditUser);
    });
