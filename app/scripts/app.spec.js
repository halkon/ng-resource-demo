describe('Encore: app', function () {
    var scope, auth, env, root, location, $window;

    beforeEach(module('encoreApp'));
    beforeEach(module(function ($provide) {
        $window = {
            location: '/template',
            document: [{ }]
        };

        $provide.constant('$window', $window);
    }));

    beforeEach(function () {
        inject(function ($controller, $rootScope, $location, Auth, Environment) {
            root = $rootScope;
            scope = $rootScope.$new();

            env = Environment;
            auth = Auth;
            auth.isAuthenticated = sinon.stub();
            auth.isAuthenticated.returns(false);

            env.get = sinon.stub();
            env.get.returns({ name: 'staging' });

            location = $location;
            location.url = sinon.stub().returns('');
        });
    });

    it('should do default auth functions', function () {
        sinon.assert.notCalled(auth.isAuthenticated);
        expect($window.location).to.be.equal('/template');
    });

    it('should change location if local route is not defined', function () {
        inject(function ($route) {
            $route.routes.null = sinon.stub(); // Prevent page reloads
            location.path('doesNotExist');
            root.$digest();

            expect(location.url.called).to.be.false;
        });
    });
});
