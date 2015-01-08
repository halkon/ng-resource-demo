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

Use `gulp karma:single` to run these tests apart from running midway/e2e tests

When you're making a lot of unit test related changes, it's faster to leave PhantomJS running (rather than spinning up a new instance every time). Use the following command to have grunt 'watch' your files:

`gulp karma:debug`

Note: While any one of the `gulp server` tasks is running, the unit tests will automatically be executed on file changes, and a `gulp karma` task is not necessary.

### Testing Individual Components

When developing a specific component, you likely don't want to run the entire test suite on every change. In order to test a single set of functionality, use the 'only' function when describing your test. For example:

`describe.only('login', function () { ... tests go here ... })`

**Be sure to remove the `only` once you're done.**

An alternative to using `only` is the `karma:watch` task. This task will watch for file changes and run only the spec that corresponds to the changed script or the spec itself if it was changed.

#### Code Coverage

Code coverage stats for our component tests are generated every time the test suite is executed. To view the stats, simply open the index.html file in any of the browser directories in the 'coverage' directory.


### Page Object Model

For both Midway and E2E tests, we use a Page Object library called [Astrolabe](https://github.com/stuplum/astrolabe).


### Midway Tests

Goal: Validate our appplication in isolation from its dependencies (e.g. API Server)

In order to run the midway test suite, you will need a selenium server running.
If you have protractor installed, you can get a selenium webdriver running with:

```
$> ./node_modules/protractor/bin/webdriver-manager update
$> ./node_modules/protractor/bin/webdriver-manager start
```

Server mocks are done using Stub.by. Server stubs are stored in the frontend/test/api-mocks folder. You need to ensure that you already have a development server running with Stub.by. If you haven't already, start up your stubbed server:

    grunt server:stubbed:watch

In order to correctly run the midway tests you will need to keep this running in the background, so open a new terminal after running this command.

    ./node_modules/protractor/bin/protractor test/conf/protractor.conf.js

You can also create a `test/conf/protractor.local.conf.js` file to use when you need dev-specific settings that you don't want used in the CICD builds. This also applies for `test/conf/protractor.local.e2e.conf.js` as well.

This template ships with some useful functionality in `test/pages/login.page.js`, but everything else in the `test/stories` directory and the `test/pages` directory should be considered an example only, and should be deleted!

#### Testing Individual Pages

When developing a specific page, it's much quicker to run tests only for that page (rather than run the entire suite every time). In order to limit the tests to just that page, pass in path to the file to test as the third option in your grunt command. For example:

`./node_modules/protractor/bin/protractor test/protractor.conf.js --specs=test/midway/cloudDetailPage.js`

### E2E Tests

Goal: Validate our app & all dependencies work in correlation as expected

#### Setting up E2E tests on Jenkins

First, set your github pull settings, build triggers, and the post-build notifications for the build status, hipchat, etc.

Here is a list of what you might want to set up:

 1. Hipchat Notifications
 - Parameterized Build (String parameter = "sha1")
 - Source Code Management
 - Build Triggers (GitHub pull requests builder)
 - Build Environment (Color ANSI Console Output, ANSI color map = xterm)
 - Execute Shell (see below for information about `jenkins.example.sh`)
 - Post build actions (Publish HTML reports, HipChat notifications, build status on Github, Delete Workspace)


You can use the [starter jenkins CICD script](./test/jenkins.example.sh) for the *"Execute shell"* step.

Be sure to set the workspace [to be deleted after each build ends](https://wiki.jenkins-ci.org/display/JENKINS/Workspace+Cleanup+Plugin), regardless of whether or not it was a success or failure.

You'll need to *exclude* the following directories and files from this cleanup process:

 - report/\**
 - coverage/\**

Check the box that says *"Apply pattern also on directories"*.

Next, you'll need to SSH into the server and edit the jenkins user's `~/secrets.js` file if necessary.

For an example of what the bare minimum is for a secrets file, see [`test/secrets.example.js`](./test/secrets.example.js).

Next, you'll want to set your app's redirect parameter in the `test/conf/protractor.conf.js` file to point to the "main" page of your team's encore app. For instance, Ticket Queue's app would change `/template/home` to `/ticketing/list`.
