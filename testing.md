# Testing

Goal: Ability to deliver features *quickly* to production with high *reliability* and *quality*

In order to support continuous development/integration, taking advantage of automated testing is a must. While the goal of automated testing is to provide full coverage, it also needs to be seemlessly integrated into the developer environment. Hopefully this README explains how this (hopefully) has been done.

## Test Levels

### Component Testing
 - Code level tests
 - Stored in same location as code (separate file with *.spec.js)
 - Best for testing services, classes and objects
 - Does contain "functional" tests (it tests browser interactions like 'click')
 - Sandboxed & Isolated testing
 - Mocking & Stubbing required
 - Fast
 - Uses Karma + Mocha + Chai + Sinon
 - Think of as testing the building blocks of the application, but not the application itself

### Midway Testing
 - Page level tests
 - Can access all parts of an application
 - Uses [stub.by](https://github.com/mrak/stubby4node) for mocking the API server responses
 - Uses selenium, protractor, astrolabe
 - Somewhat slow
 - Story Based

### E2E Testing
 - Application level tests
 - Uses live data (uses actual API server)
 - Requires its own special web server (basically requires an entire server environment to be set up)
 - Unable to access Application JavaScript code (only rendered HTML and some AngularJS info)
 - Uses selenium, protractor, astrolabe
 - Slow
 - Story Based
 - Systems Based

## Test Variants

### Smoke Tests

Goal: Validate mission critical functionality before running entire test suite

### Regression Tests

Goal: Test that all existing components work as expected


## Configuration Files

More details on these files are found in the files themselves

**karma.conf.js** - Used by our component tests

**protractor.conf.js** - Used by our midway/E2E tests

## Running Tests

NOTE: The following line is currently a lie

Testing is setup to run through the `grunt test` command. Running this should execute the entire suite of tests (component/midway/e2e).

### Component Tests (aka unit tests)

Goal: Tests smallest piece of functionality or method

Use `grunt test:unit` to run these tests apart from running midway/e2e tests

When you're making a lot of unit test related changes, it's faster to leave PhantomJS running (rather than spinning up a new instance every time). Use the following command to have grunt 'watch' your files:

`grunt test:dev`

### Testing Individual Components

When developing a specific component, you likely don't want to run the entire test suite on every change. In order to test a single set of functionality, use the 'only' function when describing your test. For example:

`describe.only('Login', function () { ... tests go here ... })`

**Be sure to remove the `only` once you're done.**

#### Full Browser Regression

By default, unit tests are only executed against PhantomJS. In order to test across Firefox, Chrome, Chrome Canary and Safari, run `grunt karma:full` (note 'karma', not 'test'). **Make sure you have all 4 browsers installed first**.

#### Code Coverage

Code coverage stats for our component tests are generated every time the test suite is executed. To view the stats, simply open the index.html file in any of the browser directories in the 'coverage' directory.


### Page Object Model

For both Midway and E2E tests, we use a Page Object library called [Astrolabe](https://github.com/stuplum/astrolabe).


### Midway Tests

Goal: Validate our appplication in isolation from its dependencies (e.g. API Server)

In order to run the midway test suite, you will need a selenium server running.
If you have homebrew installed, you can get a selenium webdriver running with:

```
$> brew install selenium-server
$> selenium-server
```

If you're running Windows or Linux, see [Selenium setup with remote drivers](http://docs.seleniumhq.org/docs/03_webdriver.jsp#running-standalone-selenium-server-for-use-with-remotedrivers).

Once you have selenium installed, you need to install [Protractor](https://github.com/angular/protractor/), the Angular Selenium Driver. Do that by running:

    npm install -g protractor

Server mocks are done using Stub.by. Server stubs are stored in the frontend/test/api-mocks folder. You need to ensure that you already have a development server running with Stub.by. If you haven't already, start up your stubbed server:

    grunt server:stubbed:watch

In order to correctly run the midway tests you will need to keep this running in the background, so open a new terminal after running this command. 

    protractor test/protractor.conf.js

You can also create a `test/protractor.conf.local.js` file to use when you need dev-specific settings that you don't want used in the CICD builds.

#### Testing Individual Pages

When developing a specific page, it's much quicker to run tests only for that page (rather than run the entire suite every time). In order to limit the tests to just that page, pass in path to the file to test as the third option in your grunt command. For example:

`protractor test/protractor.conf.js --specs=test/midway/cloudDetailPage.js`

### E2E Tests

Goal: Validate our app & all dependencies work in correlation as expected
