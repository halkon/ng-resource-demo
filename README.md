# Encore-UI Template

This is a base template designed to get you started with building a new Angular application using the [Encore-UI](http://rackerlabs.github.io/encore-ui/#/overview) framework.
There are a few things you should know about before you start coding.

### Folder Structure

* All Javascript goes into `app/scripts`
* All LESS files go into `app/styles`
* HTML files are placed into `app/views`
* HTML templates for directives go into `app/views/templates`

### Development

Gulp is used for starting a development server and watching your files. Any changes made to files while in `watch` mode
will trigger linting via JSHint and JSCS, a single pass of Karma, and a refresh in your browser via LiveReload.

A Connect server is used to serve files from within the `app` folder, and
Prism is being used as Connect middleware to offer proxy support for any API calls you need to make.

Gulp tasks can be found in `gulp/tasks`, and you are welcome to modify these as needed. You will likely only need to
modify the following tasks:

* `prism` -- This is where you will define your proxy endpoints.

### Building

The `build` task is where Gulp will compile and minify all assets into a distributable format. All JS, CSS, HTML, and
images will be compressed and placed into the `dist` folder under your app root folder.

### Getting Started

* `git clone https://github.com/rackerlabs/encore-ui-template {{yourAppName}}`
* `cd {{yourAppName}}`
* `npm install`
* `bower install`
* Set `config.appName` in package.json to `{{yourAppName}}`
* Change the base href in `index.html` to `/{{yourAppName}}/`
* Wire dependencies with `gulp wiredep`
* Make sure that you are including the template cache module in your app.js dependencies (module name should be `{{yourAppName}}.tpls`)
* Start local development server with `gulp server`

### Gulp Tasks

* `gulp wiredep` -- Injects Bower component paths into karma.conf.js and index.html. It also injects any Javascript files in `app/scripts` into your index.html.
* `gulp server` -- Start development server and watch files for changes
* `gulp server:record` -- Start server and record API responses into JSON files for mocking
* `gulp server:mock` -- Start server and mock API responses using your recorded JSON files
* `gulp karma:single` -- Run Karma in a single pass
* `gulp karma:threshold` -- Run Karma in a single pass and fail if coverage is too low
* `gulp build` -- Build distribution


### Converting from Grunt Template

The previous iteration of this template used Grunt for running tasks. While this approach may still work, it is
recommended that everyone move over to Gulp. The only files you need to modify are:

* `karma.conf.js`
* `index.html`
* `app/scripts/app.js`

Ensure that these files contain the proper comments necessary for Gulp inject and wiredep, and that you are including
the template cache module in your app.js dependencies.

### Testing

We highly encourage writing unit tests for new code whenever possible. Karma is used to run tests, and coverage
reports should be generated inside of the `coverage` folder. Tests should be using Mocha + Chai + Sinon:

* [Mocha](http://visionmedia.github.io/mocha/)
* [Chai](http://chaijs.com/)
* [Sinon](http://sinonjs.org/)
