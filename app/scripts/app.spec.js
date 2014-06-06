describe('Encore: app', function () {
    var scope, auth, env, root, $window;

    beforeEach(module('encoreApp'));
    // Hijack $window service to not allow page changes
    beforeEach(module(function ($provide) {
        $window = {
            location: {}
        };
        $provide.constant('$window', $window);
    }));

    beforeEach(function () {
        inject(function ($controller, $rootScope, Auth, Environment) {
            root = $rootScope;
            scope = $rootScope.$new();

            env = Environment;
            auth = Auth;
            auth.isAuthenticated = sinon.stub();
            auth.isAuthenticated.onCall(0).returns(false);
            auth.isAuthenticated.returns(true);
        });
    });

    it('should do default auth functions', function () {
        sinon.assert.notCalled(auth.isAuthenticated);
        root.$broadcast('$routeChangeStart');
        sinon.assert.calledOnce(auth.isAuthenticated);
        root.$broadcast('$routeChangeStart');
        sinon.assert.calledTwice(auth.isAuthenticated);
    });
});