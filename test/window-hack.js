if (beforeEach) {
    beforeEach(module(function ($provide, $windowProvider) {
        var win = $windowProvider.$get();
        $provide.constant('$window', {
            location: '', // for locations
            document: [{}], // for hotkeys
            localStorage: win.localStorage // for rxSession
        });
    }));
}