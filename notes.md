.factory('EntityResource', function (CONSTANT_URL, $resource) {
    return $resource(CONSTANT_URL, {
        urlparam1: '@instanceParamKey1',
        urlparam2: '@instanceParamKey2',
        urlparam3: '@instanceParamKey3',
        urlparam4: 'staticNonChangingValue'
    }, {
        nondefaultAction: {
            method: 'HTTPMETHOD'
            isArray: true/false
        },
        get: {
            method: 'OVERRIDEHTTPMETHOD',
            isArray: true/false
            transformResponse: [transformFn1, transformFn2, transformFn3]
        }
    }
});