describe('Billing: LoginModalCtrl', function () {
    var scope, auth, env, ctrl;

    var user = {
            username: '12345',
            token: '67890'
        },
        token = {
            access: {
                token: {
                    id: 'a56dbf8fdf584cce8c2a6f8bf296c7de'
                }
            }
        };

    beforeEach(function () {
        module('encoreApp');

        inject(function ($controller, $rootScope, $location, Auth, Environment, $q) {
            var getResourceResultMock = function (data) {
                    var deferred = $q.defer();
                    data.$promise = deferred.promise;
                    data.$deferred = deferred;
                    return data;
                },
                getResourceMock = function (returnData) {
                    returnData = getResourceResultMock(returnData);
                    return function (callData, success, error) {
                        returnData.$promise.then(success, error);
                        return returnData;
                    };
                };
            scope = $rootScope.$new();
            scope.user = user;
            env = Environment;
            auth = Auth;

            auth.isAuthenticated = sinon.stub(auth, 'isAuthenticated').returns(false);
            auth.loginWithJSON = sinon.stub(auth, 'loginWithJSON', getResourceMock(token));

            ctrl = $controller('LoginModalCtrl',{
                $scope: scope,
                Auth: auth,
                Environment: env
            });
        });
    });

    it('LoginModalCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('LoginModalCtrl expect to attempt to authenticate', function () {
        expect(ctrl).to.exist;
        scope.login();
        sinon.assert.calledOnce(auth.loginWithJSON);
    });

    it('LoginModalCtrl expect to authenticate succesfully', function () {
        var r = scope.login();
        sinon.assert.calledOnce(auth.loginWithJSON);
        scope.$apply(function () {
            r.$deferred.resolve(token);
        });
        expect(auth.getToken()).to.not.be.empty;
    });

    it('LoginModalCtrl expect to fail authentication', function () {
        var r = scope.login();
        sinon.assert.calledOnce(auth.loginWithJSON);
        scope.$apply(function () {
            r.$deferred.reject({});
        });
        expect(scope.user.token).to.be.eq('');
    });
});
