# Status
[![Build Status](https://drone.io/github.com/rackerlabs/encore-ui-template/status.png)](https://drone.io/github.com/rackerlabs/encore-ui-template/latest)

# Folder Structure

    app/                  # actual app code is stored here
        scripts/
            lib/          # 3rd-party libraries that aren't available via bower
        bower_components/
        fonts/
        images/
        styles/
        views/            # HTML for pages
            templates/    # HTML for directives
        widgets/
    test/
        midway/
        e2e/
        pages/
        api-mocks/
    coverage/             # Code coverage stats built with
    dist/                 # App code ready for
    docs/                 # API docs generated via ngdoc
    node_modules/
    styleguide/           # CSS Style Guide
    report/               # Plato code quality report

# How Files are Loaded

While it's in the roadmap to add lazy/module loading to Encore UI, currently this is not a feature of our framework. Instead, all JS files are loaded via `script` tags in the [index.html](./app/index.html) file. All CSS/LESS files are loaded via @import declarations via the [app.less](./app/styles/app.less) file.

This means that the any file used in Encore must be loaded on the initial download of the site, so **please be cognizant of this when adding large libraries/files**.

To add your files to Encore, simply edit either index.html (for JS) or app.less (for styles).

# Routes

URL routes are defined in [app.js](./app/scripts/app.js). To find out how to navigate to a specific page, look through the route definitions in that file.

# Code Quality

Plato is a very neat tool that helps measure the complexity of a codebase. It's currently setup to execute on every run of `grunt` or `grunt docs`. To
view a report, simply open the index.html file in the 'report' directory.

# CSS Style Guide

In an effort to create a "living" style guide, we've hooked up [StyleDocco](https://github.com/jacobrask/styledocco) into our LESS CSS files. To create the guide, run the following grunt command:

`grunt styleguide`

To view the style guide, simply open the 'index.html' in the 'styleguide folder'.

Styleguides are automatically created when running `grunt docs` or `grunt build`.

# Further Reading

 - [UI Setup](./ui-setup.md)
 - [Contribution Guide](./CONTRIBUTING.md)
 - [Architecture](./architecture.md)
 - [Testing](./testing.md)
 - [CSS Style Guide](./css.md)
 - [JS Style Guide](./js-styleguide.md)

# Deployment Workflow

1. Create VM
2. Deploy to Test Server (QE)
    1. *Run deploy script
    2. *Run component tests and validate they all pass
    3. Run midway tests (developer validates expected results (e.g. that failures are expected))
    4. Run code coverage stats and store
    5. Run image diff comparisons (developer validates expected results (e.g. that failures are expected))
        - Override any stale image diffs (create new baseline images)
3. Isolation Complete (QE Validated)
    1. *Run midway tests and validate all were successful
    2. *Run E2E:Smoke tests and validate successful
    3. *Code merge to master
    4. Tear down test server
4. Deploy to Staging Server
    1. *Run deploy script
    2. *Run E2E:Smoke tests and verify they pass
    3. Run E2E:Regression tests
    4. Run image diff comparisons and validate all pass
    5. *Tripwire (if any of the following criteria aren't met, halt deployment)
        - Regression tests execute in less than 30 minutes
        - % of tests run successfully (% to be defined)
5. Prod - Ready
    1. *Shiner Time

Note: `*` marks something as a must-have
