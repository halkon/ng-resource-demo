# Encore UI Developer Setup

If this is your first time, you'll need to set up your coding environment to be able to build Encore UI and work with git.

## Preparing your environment

1. Install git

Many Mac OS X and Linux systems already have git installed. If your system doesn't, see [YUI's 'How to Set Up Your Git Environment'](http://yuilibrary.com/yui/docs/tutorials/git/) for instructions.

2. Install Node.js

[Download and install Node.js](http://howtonode.org/how-to-install-nodejs) if you don't already have it installed. All of Encore UI's build tools rely on Node.js.

3. Install NPM

NPM is used to manage Node.js dependencies. If you don't already have it installed, follow [the NPM installation instructions](http://howtonode.org/introduction-to-npm) to get a copy.

4. Install Bower

Bower is used to manage UI dependencies for use within the Encore application. Run `npm install -g bower` to install Bower.

5. Install Grunt

Grunt is used to automate the UI build and test tasks for Encore. Run `npm install -g grunt` to install Grunt.

## Initial Encore Build

If you haven't already, clone the Encore repo.

`git clone https://github.rackspace.com/valkyrie/chunky_bacon/`

Once downloaded, go into the 'frontend' directory:

`cd chunky_bacon/frontend`

Finally, install the dependencies needed by Encore UI using NPM and bower:

`npm install`
`bower install`

## Running Encore UI

First, make sure you have an API server running on localhost:3000. Then, run the following command:

`grunt server`

A new browser tab should automatically open with the Encore website running in it. To log in to the website, use your Rackspace ID & RSA Pin + Token.

### 'Stubbed' Server

In order to speed development of the UI, a stubbed/mock version of the API server has been set up. This server doesn't actually have any functionality to it, aside from accepting requests and responding with some fake data.

To run/use this mock server (instead of using the full-blown API server), use the following command:

`grunt server:stubbed:watch`

This will be run in place of the normal `grunt server` command. To access the server, load `http://localhost:9000` in a browser tab.

To log in to the website, use these details to load the mock account:
Username: user
Password: pass

Note that a lot of pages aren't mocked out. It's usually a safe bet that the first link/option on a page is the one that's mocked out.