/* global _ */
/**
 * @ngdoc object
 * @name test.helpers
 * @description
 * A group of functions to be used in testing
 * @object
 */
helpers.resourceAction = function ($q, Resource, mockData) {
    var isInstance = function (inst) {
        return _.isFunction(Resource) && inst instanceof Resource;
    };
    return function (params, success, fail) {
        var data = mockData;
        if (isInstance(this)) {
            data = this;
            _.extend(data, mockData);
        }

        // In Non-Get calls, the second parameter is the body of the call
        if (_.isPlainObject(success)) {
            success = arguments[2];
            fail = arguments[3];
        }

        data.$params = params;
        data.$deferred = $q.defer();
        data.$promise = data.$deferred.promise;
        data.$promise.then(function (res) {
            _.extend(data, res);
        });
        data.$promise.then(success, fail);

        if (isInstance(this)) {
            return data.$promise;
        }
        if (_.isFunction(Resource)) {
            var r = new Resource();
            _.extend(r, data);
            return r;
        }
        return data;
    };
};
// Create a stubbed version of an action that has resource mocked
helpers.resourceStub = function ($q, Resource, action, mockData) {
    var mockAction = helpers.resourceAction($q, Resource, mockData);
    // Return the stubbed function even though sinon already does the assigment into the resource
    return sinon.stub(Resource, action, mockAction);
};