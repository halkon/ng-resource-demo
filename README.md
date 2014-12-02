# Encore-UI Template

This is a base template designed to get you started with building a new Angular application using the [Encore-UI](http://rackerlabs.github.io/encore-ui/#/overview) framework.
There are a few things you should know about before you start coding.

## Getting Started

* `git clone https://github.com/rackerlabs/encore-ui-template {{yourAppName}}`
* `cd {{yourAppName}}`
* `rm -r .git`
* `git init` -- This will make sure you aren't working out of the template repo.
* `npm install`
* `bower install`
* Set `name` in `package.json` to `{{yourAppName}}`
* Set `appName` in `config.json` to `{{yourAppName}}`
* Set `baseHref` in `config.json` to `/{{yourAppName}}/`
* Change the base href in `index.html` to `/{{yourAppName}}/`
* Make sure that you are including the template cache module in your app.js dependencies
  * module name should be `{{yourAppName}}.tpls`
* Start local development server with `gulp server`

## Directory Structure

```bash
/app
  404.html
  index.html
  /src # needed to simplify gulp/karma file selection globs
    app.js # routing to proper feature files done here
    app.spec.js
    app.less
    /common # source logic available to all application features goes here
      /assets
        /images
        /fonts
        /styles
      /directives
      /filters
      /services
      /views
      # ...
    /{feature} # all logic for a particular feature is nicely contained within its own directory
      FoobarFilter.js # common filter for use within this feature
      /images # images for the feature should be placed here (if necessary)
      /{action} # rule of thumb: if you need a new controller/view, you might need another directory
        /images # images for the feature/action should be placed here (if necessary)
        # ... files to implement particular feature/action functionality
      /create # example
        CreateFoobarCtrl.js
        CreateFoobarCtrl.spec.js
        CreateFoobar.html
        CreateFoobar.less
        # ...
      /update
      /delete
      # ...
/compiled # all compiled JS, CSS and HTML will land here
	/bower_components
/dist # reserved for deployable content
	/app # all minified & uglified code and assets land here
	/coverage # coverage information lands here
	/docs # code documentation lands here
```


### Images and Fonts

Due to the number of possible image and font extensions, the gulp file selection glob has been simplified to merely look for `app/src/**/(images|fonts)/**/*` (any file within an `images` or `fonts` directory).
As such, here are a few things to keep in mind.

* Images MUST be contained within an `images` directory somewhere in the `app/src` directory tree.
  * If your images are elsewhere, they will **not be included** by the `gulp compile:images` task.
  * Do not place non-image files in the `images` directories.
    * This will confuse the `gulp compile:images` task.
* Fonts MUST be contained within a `fonts` directory somewhere in the `app/src` directory tree.
  * If your fonts are elsewhere, they will **not be included** by the `gulp compile:fonts` task.
  * Do not place non-font files in the `fonts` directories.
    * This will confuse the `gulp compile:fonts` task.

## Development

Gulp is used for starting a development server and watching your files. Any changes made
to files while in `watch` mode will trigger linting via JSHint and JSCS, a single pass
of Karma, and a refresh in your browser via LiveReload.

A Connect server is used to serve files from within the `/compiled` directory, and Prism is being
used as Connect middleware to offer proxy support for any API calls you need to make.

Gulp tasks can be found in `gulp/tasks`, and you are welcome to modify these as needed.
You will likely only need to modify the following files:

* `gulp/util/prism.js` -- This is where you will define your proxy endpoints.

## Building

The `build` task is where Gulp will compile and minify all assets into a distributable format.
All JS, CSS, HTML, and images will be compressed and placed into the `dist/app` directory.

## Gulp Tasks
The default action when running `gulp` (without a task) is to run the `compile` task.

### compile
As a developer, you will use these tasks most as they pertain to compiling/transpiling
source code into native HTML, CSS and ES5-compatible Javascript for debugging purposes.
The output for these tasks land in the `/compiled` directory.

The `compile` task automatically runs appropriate `compile:*` tasks.

#### compile:clean
This task removes all compiled files from the `/compiled` directory while leaving the
`/compiled/bower_components` directory intact.

#### compile:images
This task takes care of placing your images into the proper location in the `/compiled`
directory.

#### compile:fonts
This task takes care of placing your fonts into the proper location in the `/compiled`
directory.

#### compile:scripts
This task takes care of any developer-friendly lazy tasks (ngAnnotate for example) as
well as performing any \*script to Javascript transpilation (if needed).

#### compile:index
This task takes care of injecting the appropriate javascripts and bower dependencies
into the `/compiled/index.html` file.

#### compile:styles
This task takes care of converting your LESS files into a bundle named `application.css`. Note that `app.less` is the entry point
for the LESS compiler, so all LESS files need to be imported or referenced using `@import` syntax within this file.

#### compile:templates
This task takes care of converting all of your HTML templates in `/app/src` into an
Angular-friendly `templates.js` for dependency injection into your application.


### build
`build` tasks are designed for use with a continuous integration service and are
typically not run manually. These tasks build from the `/compiled` directory and output
to the `/dist/app` directory.  Typically this will perform minification, uglification,
etc. to get the resulting files to a deployable state.

The `build` task will automatically run the `compile` task before it performs its actions.

#### build:clean
This task takes care of cleaning up build files within the `/dist/app` directory.

#### build:images
This task compresses images for remote deployment.


### karma
These tasks run tests.

* `gulp karma:single`
  * Run Karma in a single pass
* `gulp karma:debug`
  * Run Karma in debug mode using Chrome
* `gulp karma:threshold`
  * Run Karma in a single pass and fail if coverage is too low

#### karma:wiredep
This task injects bower dependencies into `karma.conf.js`

  * **Run this whenever your bower dependencies change**

### server
These tasks start up a local "connect" server for development purposes. All of these
tasks will open your browser and watch for changes to source files.

* `gulp server`
  * Start development server and watch files for changes
* `gulp server:record`
  * Start server and record API responses into JSON files for mocking
* `gulp server:mock`
  * Start server and mock API responses using your recorded JSON files

## Testing

We highly encourage writing unit tests for new code whenever possible. Karma is used to run tests, and coverage
reports should be generated inside of the `/dist/coverage` directory. Tests should be using Mocha + Chai + Sinon:

* [Mocha](http://visionmedia.github.io/mocha/)
* [Chai](http://chaijs.com/)
* [Sinon](http://sinonjs.org/)

To run your tests in `debug` mode, do `gulp karma:debug`. This will launch a Chrome browser and start all your tests.
When the tests have completed, the browser will stay open and you can simply reload the page to run the tests again.

Running in this mode allows you to put `debugger;` anywhere in either your tests or your source code. When a `debugger`
statement is encountered while in `karma:debug` mode *and* you've opened the Chrome Developer Tools (command-option-I on a Mac),
execution will be paused at the `debugger` and you can step through the code in Chrome. This will let you do any variable
evaluation, function call, etc. that you want.

This mode will also automatically watch for changes in your test files, and rerun the tests on change. Please note that
if execution is currently paused because of a `debugger` statement, the tests won't rerun. You can either continue
execution or simply reload the page to run the tests again.

### deployment

During deployment if using the default Encore UI Jenkins Pipeline, the script located in `bin/run-e2e` will be run for both **Staging** and **Preprod** environments upon deployment of the project for each of those environments.

Currently, this script will only be called with one argument: "staging" or "preprod" (The name of the environment lowercase)

Jenkins will call the script like so (depending on Environment)

`bash -ex bin/run-e2e staging`

`bash -ex bin/run-e2e preprod`

Feel free to update the script for proper run of tests for the environments in Jenkins.