#!/bin/bash -e
# If using a ubuntu box for builds you need to install python3 python3.3-dev

# Kill any left over grunt tasks, avoid throwing error if not orphaned process
killall grunt || true

npm install --loglevel warn
bower install --quiet
# prep for unit tests
grunt ngTemplateCache

grunt plato
grunt jshint
grunt jscs:tests
grunt test:unit

# Compile and run server
echo "Building..."
grunt server:stubbed:watch 2>&1 &

# wait until server is up
while ! curl --silent http://localhost:9000 > /dev/null 2>&1; do sleep 5; done

echo "Running tests..."
cp ~/secrets.js ./test/secrets.js
protractor test/protractor.conf.js

killall grunt || true
killall firefox || true
