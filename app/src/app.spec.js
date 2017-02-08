describe.skip('Encore: app', function () {
    var scope, auth, env, root, $window;

    beforeEach(module('encoreApp'));
    beforeEach(module(function ($provide) {
        // Instead of replacing the whole $window service
        // let's override it's location property into a new object
        // replacing the angular one to limit functionality and changing
        // URLs
        $provide.decorator('$window', function ($delegate) {
            $window = {
                location: '/template'
            };
            // This is done so that the redirect logic has the correct path
            // This is also needed for services being run in the .run section
            // specifically oriLocationService and navItemPrefix
            _.extend($window.location.constructor.prototype, {
                protocol: 'http:',
                host: 'some.domain.encore.com',
                pathname: '/template'
            });

            // Let's revert it back to normal
            $window.oldLocation = $delegate.location;
            _.defaults($window, $delegate);
            return $window;
        });
    }));

    beforeEach(function () {
        inject(function ($controller, $rootScope, Auth, Environment) {
            root = $rootScope;
            scope = $rootScope.$new();

            env = Environment;
            auth = Auth;
            auth.isAuthenticated = sinon.stub();
            auth.isAuthenticated.returns(false);

            env.isLocal = sinon.stub();
            env.isLocal.returns(false);
        });
    });

    afterEach(function () {
        // remove any traces of this madness
        $window.location = $window.oldLocation;
    });

    it('should not check auth functions at first cycle', function () {
        sinon.assert.notCalled(auth.isAuthenticated);
        expect($window.location).to.be.equal('/template');
    });

    it('should check auth at start first cycle of app', function () {
        sinon.assert.notCalled(auth.isAuthenticated);
        expect($window.location).to.be.equal('/template');
        root.$digest();
        sinon.assert.calledTwice(auth.isAuthenticated);
        expect($window.location).to.be.equal('/login?redirect=/template');
    });
});
