# Encore-UI Template

This is a base template designed to get you started with building a new Angular application using the [Encore-UI](http://rackerlabs.github.io/encore-ui/#/overview) framework.
There are a few things you should know about before you start coding.

### Folder Structure

```bash
/app
  404.html
  index.html
  /bower_components
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
```

#### Images ####

Due to the sheer number of possible image extensions, the gulp file selection glob for images has been simplified to merely look for `app/src/**/images/**/*` (any file within an `images` directory).
As such, here are a few things to keep in mind.

* `Images` MUST be contained within an `images` directory somewhere in the `app/src` directory tree.
  * If your images are elsewhere, they will **not be included** by the `gulp images` task.
* Do not place non-image files in the `images` directories.
  * This will confuse the `gulp images` task.

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
* `rm -r .git`
* `git init` -- This will make sure you aren't working out of the template repo.
* `npm install`
* `bower install`
* Set `config.appName` in package.json to `{{yourAppName}}`
* Change the base href in `index.html` to `/{{yourAppName}}/`
* Wire dependencies with `gulp wiredep`
* Make sure that you are including the template cache module in your app.js dependencies (module name should be `{{yourAppName}}.tpls`)
* Start local development server with `gulp server`

### Gulp Tasks

* `gulp wiredep` -- Injects Bower component paths into karma.conf.js and index.html. It also injects any Javascript files in `app/src/**/*` into your index.html.
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
