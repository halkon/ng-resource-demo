
describe('Encore: HomeCtrl', function () {
    var scope, ctrl;
    beforeEach(function () {
        module('encoreApp');
        inject(function ($controller, $rootScope) {
            scope = $rootScope.$new();

            ctrl = $controller('HomeCtrl',{
                $scope: scope
            });
        });
    });

    it('HomeCtrl should exist', function () {
        expect(ctrl).to.exist;
    });

    it('HomeCtrl should automatically set default value for "hello"', function () {
        expect(scope.hello).to.not.be.empty;
        expect(scope.hello).to.eq('Hello Developer');
    });
});